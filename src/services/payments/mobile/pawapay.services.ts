import { Service } from "typedi";
import { SUPPORTED_CURRENCIES } from "../../../utils/enums/payment";
import axios, { AxiosResponse } from "axios";
import { COUNTRY_CODE } from "../../../utils/enums/common";
import config from "../../../config";
import logger from "../../../utils/logger";
import crypto from "node:crypto";
// import { formatPawaPayError } from "../../../utils/format.text";
import RecipientServices from "../recipient.services";
import { logError } from "../../../utils/errors/errors.utils";
import { v4 as uuid } from "uuid";

@Service()
export default class PawaPayService {
  private _uri = config.PAWAPAY_BASE_URL;
  private _apiToken = config.PAWAPAY_TOKEN;

  constructor(private recipientService: RecipientServices) {}

  async initializePayment({
    amount,
    currency,
    phone,
    appName,
  }: {
    amount: number;
    currency: SUPPORTED_CURRENCIES;
    phone: string;
    appName: string;
  }) {
    // Get informations on payer's country
    const { correspondent } = await this.predictCorrespondent(phone);

    const depositId = uuid();

    return axios
      .post(
        `${this._uri}/deposits`,
        {
          depositId,
          amount,
          currency,
          correspondent,
          payer: {
            type: "MSISDN",
            address: {
              value: phone,
            },
          },
          customerTimestamp: new Date(),
          statementDescription: `Payment to ${appName}`,
        },
        {
          headers: {
            Authorization: `Bearer ${this._apiToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response: AxiosResponse<{ depositId: string }>) => {
        const { depositId } = response.data;

        return { reference: depositId };
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
    // let targetRecipient;
    // // Try to find out if this recipient already registered
    // targetRecipient = await this.recipientService.getRecipient({
    //   phone,
    // });
    // targetRecipient = targetRecipient?.reference;
    // if (!targetRecipient) {
    //   // Create a PAWAPAY recipient first then proceed to transfer
    //   const { recipient } = await this.createRecipient({ phone });
    //   targetRecipient = recipient;
    // }
    // // Initiate transfer
    // if (targetRecipient) {
    //   return axios
    //     .post(
    //       `${this._uri}/transfers`,
    //       {
    //         recipient: targetRecipient,
    //         amount,
    //         currency,
    //         description: "At et veniam ut laboriosam aut sint id voluptas.",
    //       },
    //       {
    //         headers: {
    //           Authorization: this._apiToken,
    //           ["X-Grant"]: this._sk,
    //           Accept: "application/json",
    //         },
    //         timeout: 5000,
    //       }
    //     )
    //     .then((response) => {
    //       const {
    //         transfer: { reference },
    //       } = response.data;
    //       return reference as string;
    //     })
    //     .catch((error) => {
    //       logger.error(error.message);
    //       throw error;
    //     });
    // }
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
    // const {
    //   event,
    //   data: { reference },
    // } = payload;
    // if (event == "payment.complete") {
    //   await successfulPaymentCb({ trxRef: reference });
    // }
    // if (
    //   event == "payment.failed" ||
    //   event == "payment.expired" ||
    //   event == "payment.canceled"
    // ) {
    //   await failedPaymentCb({
    //     trxRef: reference,
    //     failMessage: formatPawaPayError(event),
    //   });
    // }
  }

  private isValidWebhook({
    signature,
    payload,
  }: {
    signature: string;
    payload: any;
  }) {
    // const hash = crypto
    //   .createHmac("sha256", this._webHookSecretHash)
    //   .update(JSON.stringify(payload))
    //   .digest("hex");
    // return hash == signature;
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

  // Create a PAWAPAY recipient
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
    // return axios
    //   .post(
    //     `${this._uri}/recipients`,
    //     {
    //       phone,
    //       name,
    //       email,
    //       country,
    //       channel: "cm.mobile",
    //       number: phone,
    //       description:
    //         "Hic blanditiis voluptatem nobis ut saepe dolorem molestiae dolorum.",
    //     },
    //     {
    //       headers: {
    //         ["X-Grant"]: this._sk,
    //         Authorization: this._apiToken,
    //       },
    //     }
    //   )
    //   .then(async (response: AxiosResponse<{ recipient: { id: string } }>) => {
    //     const {
    //       recipient: { id: recipient },
    //     } = response.data;
    //     // Persist  recipient to DB before returning it
    //     await this.recipientService.createRecipient({
    //       reference: recipient,
    //       phone,
    //       email,
    //     });
    //     return { recipient };
    //   })
    //   .catch((error) => {
    //     throw error;
    //   });
  }

  private async predictCorrespondent(phone: string) {
    return axios
      .post(
        `${this._uri}/v1/predict-correspondent`,
        { msisdn: phone },
        { headers: { Authorization: `Bearer ${this._apiToken}` } }
      )
      .then(
        (
          response: AxiosResponse<{
            country: string;
            operator: string;
            correspondent: string;
            msisdn: string;
          }>
        ) => {
          const { correspondent } = response.data;

          return { correspondent };
        }
      )
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  // Get transfer
  async getTransfer({ reference }: { reference: string }) {
    // return axios
    //   .get(`${this._uri}/transfers/${reference}`, {
    //     headers: {
    //       Authorization: this._apiToken,
    //       ["X-Grant"]: this._sk,
    //     },
    //   })
    //   .then((response) => response.data.transfer)
    //   .catch((error) => logError(error));
  }
}
