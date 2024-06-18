import { Service } from "typedi";
import {
  SUPPORTED_CURRENCIES,
  TRANSACTION_TYPE,
} from "../../../utils/enums/payment";
import axios from "axios";
import { ENV } from "../../../utils/enums/common";
import config from "../../../config";
import logger from "../../../utils/logger";
import crypto from "node:crypto";
import { formatNotchPayError } from "../../../utils/format.text";

@Service()
export default class NotchPayService {
  private _webHookSecretHash =
    config.APP_ENV === ENV.PRODUCTION
      ? config.NOTCHPAY_WEBHOOK_SECRET_HASH_LIVE
      : config.NOTCHPAY_WEBHOOK_SECRET_HASH_TEST;

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
              config.APP_ENV == ENV.PRODUCTION
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

  async initializeTransfer({
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
        `${config.NOTCHPAY_BASE_URL}/transfers`,
        {
          amount,
          currency,
          channel: "cm.mobile",
          beneficiary: { phone },
          description: TRANSACTION_TYPE.CASHOUT,
          reference: config.NOTCHPAY_REFERENCE,
        },
        {
          headers: {
            Authorization:
              config.APP_ENV == ENV.PRODUCTION
                ? config.NOTCHPAY_PUBLIC_KEY_LIVE
                : config.NOTCHPAY_PUBLIC_KEY_TEST,
            "Grant-Authorization":
              config.APP_ENV == ENV.PRODUCTION
                ? config.NOTCHPAY_SECRET_KEY_LIVE
                : config.NOTCHPAY_SECRET_KEY_TEST,
            Accept: "application/json",
          },
          timeout: 5000,
        }
      )
      .then((response) => {
        const {
          transfer: { reference },
        } = response.data;

        return reference as string;
      })
      .catch((error) => {
        logger.error(error.message);
        throw error;
      });
  }

  async handleWebhook({
    signature,
    payload,
    successfulPaymentCb,
    failedPaymentCb,
  }: {
    signature: string;
    payload: any;
    successfulPaymentCb: ({ trxRef }: { trxRef: string }) => Promise<void>;
    failedPaymentCb: ({
      trxRef,
      failMessage,
    }: {
      trxRef: string;
      failMessage: string;
    }) => Promise<void>;
  }) {
    // if (!this.isValidWebhook({ signature, payload })) {
    //   throw new ApiError("Invalid webhook params", HTTP.BAD_REQUEST);
    // }

    const {
      event,
      data: { reference },
    } = payload;

    if (event == "payment.complete") {
      await successfulPaymentCb({ trxRef: reference });
    }

    if (
      event == "payment.failed" ||
      event == "payment.expired" ||
      event == "payment.canceled"
    ) {
      await failedPaymentCb({
        trxRef: reference,
        failMessage: formatNotchPayError(event),
      });
    }
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
