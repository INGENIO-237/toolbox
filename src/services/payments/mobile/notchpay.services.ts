import { Service } from "typedi";
import {
  PAYMENT_STATUS,
  SUPPORTED_CURRENCIES,
} from "../../../utils/enums/payment";
import axios from "axios";
import http from "node:http";
import { ENV } from "../../../utils/enums/common";
import config from "../../../config";
import logger from "../../../utils/logger";
import ApiError from "../../../utils/errors/errors.base";
import HTTP from "../../../utils/constants/http.responses";
import crypto from "node:crypto";
import { MobilePaymentRepository } from "../../../repositories/payments";
import { formatNotchPayError } from "../../../utils/format.text";

@Service()
export default class NotchPayService {
  private _webHookSecretHash =
    config.NODE_ENV === ENV.PRODUCTION
      ? config.NOTCHPAY_WEBHOOK_SECRET_HASH_LIVE
      : config.NOTCHPAY_WEBHOOK_SECRET_HASH_TEST;

  constructor(private repository: MobilePaymentRepository) {}

  async initializePayment({
    amount,
    currency,
    phone,
  }: {
    amount: number;
    currency: SUPPORTED_CURRENCIES;
    phone: string;
  }) {
    return axios
      .post(
        `${config.NOTCHPAY_BASE_URL}/payments/initialize`,
        { amount, currency, phone },
        {
          headers: {
            Authorization:
              config.NODE_ENV == ENV.PRODUCTION
                ? config.NOTCHPAY_PUBLIC_KEY_LIVE
                : config.NOTCHPAY_PUBLIC_KEY_TEST,
          },
          timeout: 5000,
        }
      )
      .then((response) => {
        const {
          transaction: { reference },
          authorization_url,
        } = response.data;
        console.log({ authorization_url });
        return reference as string;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  async handleWebhook({
    signature,
    payload,
  }: {
    signature: string;
    payload: any;
  }) {
    // if (!this.isValidWebhook({ signature, payload })) {
    //   throw new ApiError("Invalid webhook params", HTTP.BAD_REQUEST);
    // }

    const {
      event,
      data: { reference },
    } = payload;

    if (event == "payment.complete") {
      await this.handleSuccessfullPayment({ trxRef: reference });

      // TODO: Update app balance
    }

    if (
      event == "payment.failed" ||
      event == "payment.expired" ||
      event == "payment.canceled"
    ) {
      await this.handleFailedPayment({
        trxRef: reference,
        failMessage: formatNotchPayError(event),
      });
    }
  }

  private async handleSuccessfullPayment({ trxRef }: { trxRef: string }) {
    await this.repository.updatePayment({
      trxRef,
      status: PAYMENT_STATUS.SUCCEEDED,
    });
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

  private isValidWebhook({
    signature,
    payload,
  }: {
    signature: string;
    payload: any;
  }) {
    const hash = crypto
      .createHmac("sha256", this._webHookSecretHash)
      .update(JSON.stringify(payload))
      .digest("hex");
      
    return hash == signature;
    // amount: 2000,
    //   amount_total: 2000,
    //   sandbox: true,
    //   fee: 0,
    //   converted_amount: 2000,
    //   customer: 'cus.test_OaJ1rlxty8OGWldI',
    //   reference: 'trx.test_MgsyOYEw3nVvCM0xSfP4s23M',
    //   status: 'pending',
    //   currency: 'XAF',
    //   created_at: '2024-05-13T17:33:20.000000Z',
    //   updated_at: '2024-05-13T17:33:20.000000Z'
  }
}
