import "reflect-metadata";

import EventEmitter from "node:events";
import { PAYMENT_HOOK_ACTIONS } from "../utils/constants/hooks.actions";
import Container from "typedi";
import { PARTNERS, TRANSACTION_TYPE } from "../utils/enums/payment";
import { NotchPayService, PawaPayService } from "../services/payments/mobile";
import { MobilePaymentService } from "../services/payments";

const PaymentsHooks = new EventEmitter();

PaymentsHooks.on(
  PAYMENT_HOOK_ACTIONS.INITIATED_TRANSFER,
  (trxRef: string, partner: PARTNERS) => {
    const mobileService = Container.get(MobilePaymentService);

    switch (partner) {
      case PARTNERS.NOTCHPAY:
        let timeout = 30000; // 15 times 2000 = 30s
        let exit = false;

        const notchPayService = Container.get(NotchPayService);

        const interval = setInterval(async (): Promise<any> => {
          timeout -= 2000;
          try {
            const transfer = await notchPayService.getTransfer({
              reference: trxRef,
            });

            if (transfer.status == "complete") {
              await mobileService.handleSuccessfullPayment({
                trxRef,
                type: TRANSACTION_TYPE.CASHOUT,
                amount: transfer.amount_total as number,
              });

              exit = true;
            }

            if (transfer.status == "failed") {
              await mobileService.handleFailedPayment({
                trxRef,
                failMessage: "Transfer has failed",
              });
              exit = true;
            }
            if (transfer.status == "rejected") {
              await mobileService.handleFailedPayment({
                trxRef,
                failMessage:
                  "Transfer has been rejected by our system or by operator",
              });
              exit = true;
            }
            if (transfer.status == "expired") {
              await mobileService.handleFailedPayment({
                trxRef,
                failMessage: "Transfer has expired after 3 hours",
              });
              exit = true;
            }
          } catch (error) {
            throw error;
          }

          if (timeout < 1 || exit) clearInterval(interval);
        }, 2000);
        break;

      default:
        break;
    }
  }
);

export default PaymentsHooks;
