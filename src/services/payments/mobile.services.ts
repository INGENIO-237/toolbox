import { Service } from "typedi";
import {
  CreateMobilePaymentInput,
  CreateMobileTransferInput,
} from "../../schemas/payments";
import PartnerService from "../partner.services";
import { ACCOUNT_MODE, COUNTRY_CODE, ENV } from "../../utils/enums/common";
import ApiError from "../../utils/errors/errors.base";
import HTTP from "../../utils/constants/http.responses";
import { PartnerDocument } from "../../models/partner.model";
import {
  BALANCE_TYPE,
  PARTNERS,
  PAYMENT_STATUS,
  SUPPORTED_CURRENCIES,
  TRANSACTION_TYPE,
} from "../../utils/enums/payment";
import { MobilePaymentRepository } from "../../repositories/payments";
import { NotchPayService, PawaPayService } from "./mobile";
import {
  MobilePaymentDocument,
  Provider,
} from "../../models/payments/mobile.model";
import isValidPhoneNumber from "../../utils/phone";
import config from "../../config";
import AppsService from "../apps.services";
import { PaymentsHooks } from "../../hooks";
import { PAYMENT_HOOK_ACTIONS } from "../../utils/constants/hooks.actions";

@Service()
export default class MobilePaymentService {
  constructor(
    private partnerService: PartnerService,
    private repository: MobilePaymentRepository,
    private appService: AppsService,
    private notchpay: NotchPayService,
    private pawaPay: PawaPayService
  ) {}

  async initializePayment(
    data: CreateMobilePaymentInput["body"] & {
      mode: ACCOUNT_MODE;
      app: { id: string; name: string };
    }
  ) {
    const {
      amount,
      currency,
      provider: { name, country },
      phone,
      mode,
      app,
    } = data;

    if (!isValidPhoneNumber(phone)) {
      throw new ApiError("Invalid phone number", HTTP.BAD_REQUEST);
    }

    if (config.APP_ENV === ENV.PRODUCTION && mode === ACCOUNT_MODE.test) {
      throw new ApiError(
        "You are not allowed to use this service in production. Contact support.",
        HTTP.FORBIDDEN
      );
    }

    const partner = await this.findAppropriatePartner({
      method: name,
      country,
    });

    if (!partner) {
      throw new ApiError(
        "No available partner for the provided method and country",
        HTTP.NOT_FOUND
      );
    }

    return await this.handlePaymentInitialization({
      partner,
      app,
      amount,
      currency,
      phone,
      provider: {
        name,
        country,
      },
    });
  }

  async initializeTransfer(
    data: CreateMobileTransferInput["body"] & {
      mode: ACCOUNT_MODE;
      app: string;
    }
  ) {
    const {
      amount,
      currency = SUPPORTED_CURRENCIES.XAF,
      provider: { name, country },
      phone,
      mode,
      app,
    } = data;

    if (!isValidPhoneNumber(phone)) {
      throw new ApiError("Invalid phone number", HTTP.BAD_REQUEST);
    }

    if (config.APP_ENV === ENV.PRODUCTION && mode === ACCOUNT_MODE.test) {
      throw new ApiError(
        "You are not allowed to use this service in production. Contact support.",
        HTTP.FORBIDDEN
      );
    }

    const partner = await this.findAppropriatePartner({
      method: name,
      country,
    });

    const appDocument = await this.appService.getApp({ appId: app });

    // Raise Insufficient balance if balance < requested transfer amount
    if (appDocument.balance.mobile < amount) {
      throw new ApiError(
        `Insufficient balance. Your actual balance is: ${appDocument.balance.mobile} ${currency}`,
        HTTP.BAD_REQUEST
      );
    }

    if (!partner) {
      throw new ApiError(
        "No available partner for the provided method and country",
        HTTP.NOT_FOUND
      );
    }

    return await this.handleTransferInitialization({
      partner,
      app,
      amount,
      currency,
      phone,
      provider: {
        name,
        country,
      },
    });
  }

  private async findAppropriatePartner({
    method,
    country,
  }: {
    method: string;
    country: COUNTRY_CODE;
  }) {
    return await this.partnerService.getPartner({ method, country });
  }

  private async handlePaymentInitialization({
    partner,
    amount,
    currency = SUPPORTED_CURRENCIES.XAF,
    phone,
    provider,
    app,
  }: {
    partner: PartnerDocument;
    amount: number;
    currency?: SUPPORTED_CURRENCIES;
    phone: string;
    provider: Provider;
    app: { id: string; name: string };
  }) {
    switch (partner.name) {
      case PARTNERS.NOTCHPAY:
        // Initialize payment with the partner
        const { reference: referenceNocthPay, authorization_url } =
          await this.notchpay.initializePayment({
            amount,
            currency,
            phone,
          });

        // Persist payment initialization
        const { ref: refNotchPay } = await this.repository.initializePayment({
          partner: partner._id as string,
          amount,
          currency,
          phone,
          provider,
          transactionType: TRANSACTION_TYPE.CASHIN,
          trxRef: referenceNocthPay,
          app: app.id,
        });

        return { ref: refNotchPay, authorization_url };
      case PARTNERS.PAWAPAY:
        // Initialize payment with the partner
        const { reference: referencePawaPay } =
          await this.pawaPay.initializePayment({
            amount,
            currency,
            phone,
            appName: app.name,
          });

        // Persist payment initialization
        const { ref: refPawaPay } = await this.repository.initializePayment({
          partner: partner._id as string,
          amount,
          currency,
          phone,
          provider,
          transactionType: TRANSACTION_TYPE.CASHIN,
          trxRef: referencePawaPay,
          app: app.id,
        });

        return { ref: refPawaPay };

      default:
        throw new ApiError("Invalid partner", HTTP.INTERNAL_SERVER_ERROR);
    }
  }

  private async handleTransferInitialization({
    partner,
    amount,
    currency = SUPPORTED_CURRENCIES.XAF,
    phone,
    provider,
    app,
  }: {
    partner: PartnerDocument;
    amount: number;
    currency?: SUPPORTED_CURRENCIES;
    phone: string;
    provider: Provider;
    app: string;
  }) {
    let reference;
    switch (partner.name) {
      case PARTNERS.NOTCHPAY:
        // Initialize transfer with the partner
        reference = await this.notchpay.initializeTransfer({
          amount,
          currency,
          phone,
        });

        // Persist transfer
        const { ref: notchPayRef } = await this.repository.initializePayment({
          partner: partner._id as string,
          amount,
          currency,
          phone,
          provider,
          transactionType: TRANSACTION_TYPE.CASHOUT,
          trxRef: reference as string,
          app,
        });

        /**
         * Emit INITIATED_TRANSFER so that we can track
         * the transfer in order to update its status
         */
        PaymentsHooks.emit(
          PAYMENT_HOOK_ACTIONS.INITIATED_TRANSFER,
          reference,
          partner.name
        );

        return notchPayRef;
      case PARTNERS.PAWAPAY:
        // Initialize transfer with the partner
        reference = await this.notchpay.initializeTransfer({
          amount,
          currency,
          phone,
        });

        // Persist transfer
        const { ref: pawaPayRef } = await this.repository.initializePayment({
          partner: partner._id as string,
          amount,
          currency,
          phone,
          provider,
          transactionType: TRANSACTION_TYPE.CASHOUT,
          trxRef: reference as string,
          app,
        });

        /**
         * Emit INITIATED_TRANSFER so that we can track
         * the transfer in order to update its status
         */
        PaymentsHooks.emit(
          PAYMENT_HOOK_ACTIONS.INITIATED_TRANSFER,
          reference,
          partner.name
        );

        return pawaPayRef;
      default:
        throw new ApiError("Invalid partner", HTTP.INTERNAL_SERVER_ERROR);
    }
  }

  async handleWebhook({
    partner,
    signature,
    data,
  }: {
    partner: string;
    signature: string;
    data: any;
  }) {
    switch (partner) {
      // case PARTNERS.NOTCHPAY:
      //   await this.notchpay.handleWebhook({
      //     signature,
      //     payload: data,
      //     successfulPaymentCb: this.handleSuccessfullPayment.bind(this),
      //     failedPaymentCb: this.handleFailedPayment.bind(this),
      //   });
      //   break;
      case PARTNERS.PAWAPAY:
        await this.pawaPay.handleWebhook({
          signature,
          payload: data,
          successfulPaymentCb: this.handleSuccessfullPayment.bind(this),
          failedPaymentCb: this.handleFailedPayment.bind(this),
        });
        break;

      default:
        throw new ApiError("Invalid partner", HTTP.BAD_REQUEST);
    }
  }

  async handleSuccessfullPayment({
    trxRef,
    type = TRANSACTION_TYPE.CASHIN,
    amount,
  }: {
    trxRef: string;
    type: TRANSACTION_TYPE;
    amount?: number;
  }) {
    await this.repository.updatePayment({
      trxRef,
      status: PAYMENT_STATUS.SUCCEEDED,
    });

    // Update app balance
    const payment = (await this.repository.getPayment({
      trxRef,
    })) as MobilePaymentDocument;

    await this.appService.updateBalance(
      payment.app as string,
      amount ? amount : payment.amount,
      BALANCE_TYPE.MOBILE,
      type
    );
  }

  async handleFailedPayment({
    trxRef,
    failMessage,
  }: {
    trxRef: string;
    failMessage: string;
  }) {
    await this.repository.updatePayment({
      trxRef,
      failMessage:
        failMessage && failMessage !== "" ? failMessage : PAYMENT_STATUS.FAILED,
      status: PAYMENT_STATUS.FAILED,
    });
  }

  async getPayment({
    reference,
    raiseException = true,
  }: {
    reference: string;
    raiseException?: boolean;
  }) {
    const payment = await this.repository.getPayment({ ref: reference });

    if (!payment && raiseException) {
      throw new ApiError("Payment not found", HTTP.NOT_FOUND);
    }

    return payment;
  }
}
