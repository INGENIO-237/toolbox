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
import { NotchPayService } from "./mobile";
import {
  MobilePaymentDocument,
  Provider,
} from "../../models/payments/mobile.model";
import isValidPhoneNumber from "../../utils/phone";
import config from "../../config";
import AppsService from "../apps.services";

@Service()
export default class MobilePaymentService {
  constructor(
    private partnerService: PartnerService,
    private repository: MobilePaymentRepository,
    private appService: AppsService,
    private notchpay: NotchPayService
  ) { }

  async initializePayment(
    data: CreateMobilePaymentInput["body"] & { mode: ACCOUNT_MODE; app: string }
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
    currency,
    phone,
    provider,
    app,
  }: {
    partner: PartnerDocument;
    amount: number;
    currency: SUPPORTED_CURRENCIES;
    phone: string;
    provider: Provider;
    app: string;
  }) {
    switch (partner.name) {
      case PARTNERS.NOTCHPAY:
        // Initialize payment with the partner
        const reference = await this.notchpay.initializePayment({
          amount,
          currency,
          phone,
        });

        // Persist payment initialization
        const { ref } = await this.repository.initializePayment({
          partner: partner._id.toString(),
          amount,
          currency,
          phone,
          provider,
          transactionType: TRANSACTION_TYPE.CASHIN,
          trxRef: reference,
          app,
        });

        return ref;

      default:
        throw new ApiError("Invalid partner", HTTP.INTERNAL_SERVER_ERROR);
    }
  }

  private async handleTransferInitialization({
    partner,
    amount,
    currency,
    phone,
    provider,
    app,
  }: {
    partner: PartnerDocument;
    amount: number;
    currency: SUPPORTED_CURRENCIES;
    phone: string;
    provider: Provider;
    app: string;
  }) {
    switch (partner.name) {
      case PARTNERS.NOTCHPAY:
        // Initialize transfer with the partner
        const reference = await this.notchpay.initializeTransfer({
          amount,
          currency,
          phone,
        });

        // Persist transfer
        const { ref } = await this.repository.initializePayment({
          partner: partner._id.toString(),
          amount,
          currency,
          phone,
          provider,
          transactionType: TRANSACTION_TYPE.CASHOUT,
          trxRef: reference,
          app,
        });

        return ref;

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
      case PARTNERS.NOTCHPAY:
        await this.notchpay.handleWebhook({
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

  private async handleSuccessfullPayment({ trxRef }: { trxRef: string }) {
    await this.repository.updatePayment({
      trxRef,
      status: PAYMENT_STATUS.SUCCEEDED,
    });

    // Update app balance
    const payment = (await this.repository.getPayment({
      trxRef,
    })) as MobilePaymentDocument;

    await this.appService.updateBalance(
      payment.app.toString(),
      payment.amount,
      BALANCE_TYPE.MOBILE
    );
  }

  private async handleFailedPayment({
    trxRef,
    failMessage,
  }: {
    trxRef: string;
    failMessage: string;
  }) {
    await this.repository.updatePayment({
      trxRef,
      failMessage,
      status: PAYMENT_STATUS.FAILED,
    });
  }
}
