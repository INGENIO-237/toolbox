import { Service } from "typedi";
import { CreateMobilePaymentInput } from "../../schemas/payments";
import PartnerService from "../partner.services";
import { ACCOUNT_MODE, COUNTRY_CODE } from "../../utils/enums/common";
import ApiError from "../../utils/errors/errors.base";
import HTTP from "../../utils/constants/http.responses";
import { PartnerDocument } from "../../models/partner.model";
import {
  PARTNERS,
  SUPPORTED_CURRENCIES,
  TRANSACTION_TYPE,
} from "../../utils/enums/payment";
import { MobilePaymentRepository } from "../../repositories/payments";
import { NotchPayService } from "./mobile";
import { Provider } from "../../models/payments/mobile.model";
import isValidPhoneNumber from "../../utils/phone";

@Service()
export default class MobilePaymentService {
  constructor(
    private partnerService: PartnerService,
    private repository: MobilePaymentRepository,
    private notchpay: NotchPayService
  ) {}

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
      mode,
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
    mode,
    provider,
    app,
  }: {
    partner: PartnerDocument;
  } & {
    amount: number;
    currency: SUPPORTED_CURRENCIES;
    phone: string;
    provider: Provider;
  } & {
    mode: ACCOUNT_MODE;
    app: string;
  }) {
    switch (partner.name) {
      case PARTNERS.NOTCHPAY:
        // Initialize payment with the partner
        const reference = await this.notchpay.initializePayment({
          baseUrl: partner.baseUrl,
          mode,
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
}
