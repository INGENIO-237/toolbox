import { Service } from "typedi";
import { SUPPORTED_CURRENCIES } from "../../../utils/enums/payment";
import axios, { AxiosResponse } from "axios";
import { COUNTRY_CODE } from "../../../utils/enums/common";
import config from "../../../config";
import logger from "../../../utils/logger";
import crypto from "node:crypto";
import { formatNotchPayError } from "../../../utils/format.text";
import RecipientServices from "../recipient.services";
import { logError } from "../../../utils/errors/errors.utils";

@Service()
export default class NotchPayService {
  private _uri = config.NOTCHPAY_BASE_URL;
  private _pk = config.NOTCHPAY_PUBLIC_KEY;
  private _sk = config.NOTCHPAY_SECRET_KEY;

  private _webHookSecretHash = config.NOTCHPAY_WEBHOOK_SECRET_HASH;

  constructor(private recipientService: RecipientServices) {}

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
        `${this._uri}/payments/initialize`,
        { amount, currency, phone },
        {
          headers: {
            Authorization: this._pk,
          },
          timeout: 10000,
        }
      )
      .then((response) => {
        const {
          transaction: { reference },
          authorization_url,
        } = response.data;
        logger.info(authorization_url.toString());
        return { reference: reference as string, authorization_url };
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
    let targetRecipient;

    // Try to find out if this recipient already registered
    targetRecipient = await this.recipientService.getRecipient({
      phone,
    });

    targetRecipient = targetRecipient?.reference;

    if (!targetRecipient) {
      // Create a NOTCHPAY recipient first then proceed to transfer
      const { recipient } = await this.createRecipient({ phone });

      targetRecipient = recipient;
    }

    // Initiate transfer
    if (targetRecipient) {
      return axios
        .post(
          `${this._uri}/transfers`,
          {
            recipient: targetRecipient,
            amount,
            currency,
            description: "At et veniam ut laboriosam aut sint id voluptas.",
          },
          {
            headers: {
              Authorization: this._pk,
              ["X-Grant"]: this._sk,
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

  // Create a NOTCHPAY recipient
  private async createRecipient({
    name = "John Doe",
    email = config.DEFAULT_RECIPIENT_EMAIL,
    phone,
    country = COUNTRY_CODE.CM,
  }: {
    name?: string;
    email?: string;
    phone: string;
    country?: COUNTRY_CODE;
  }) {
    return axios
      .post(
        `${this._uri}/recipients`,
        {
          phone,
          name,
          email,
          country,
          channel: "cm.mobile",
          number: phone,
          description:
            "Hic blanditiis voluptatem nobis ut saepe dolorem molestiae dolorum.",
        },
        {
          headers: {
            ["X-Grant"]: this._sk,
            Authorization: this._pk,
          },
        }
      )
      .then(async (response: AxiosResponse<{ recipient: { id: string } }>) => {
        const {
          recipient: { id: recipient },
        } = response.data;

        // Persist  recipient to DB before returning it
        await this.recipientService.createRecipient({
          reference: recipient,
          phone,
          email,
        });

        return { recipient };
      })
      .catch((error) => {
        throw error;
      });
  }

  // Get transfer
  async getTransfer({ reference }: { reference: string }) {
    return axios
      .get(`${this._uri}/transfers/${reference}`, {
        headers: {
          Authorization: this._pk,
          ["X-Grant"]: this._sk,
        },
      })
      .then((response) => response.data.transfer)
      .catch((error) => logError(error));
  }
}
