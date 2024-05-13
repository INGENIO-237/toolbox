import { Service } from "typedi";
import { SUPPORTED_CURRENCIES } from "../../../utils/enums/payment";
import axios from "axios";
import { ACCOUNT_MODE } from "../../../utils/enums/common";
import config from "../../../config";
import logger from "../../../utils/logger";

@Service()
export default class NotchPayService {
  async initializePayment({
    baseUrl,
    amount,
    currency,
    phone,
    mode,
  }: {
    baseUrl: string;
    amount: number;
    currency: SUPPORTED_CURRENCIES;
    phone: string;
    mode: ACCOUNT_MODE;
  }) {
    return axios
      .post(
        baseUrl + "/payments/initialize",
        { amount, currency, phone },
        {
          headers: {
            Authorization:
              mode == ACCOUNT_MODE.test
                ? config.NOTCHPAY_PUBLIC_KEY_TEST
                : config.NOTCHPAY_PUBLIC_KEY_LIVE,
          },
        }
      )
      .then((response) => {
        const {
          transaction: { reference },
        } = response.data;

        return reference as string;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }
}
