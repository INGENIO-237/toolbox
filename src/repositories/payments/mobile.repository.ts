import { Service } from "typedi";
import { CreateMobilePaymentInput } from "../../schemas/payments";
import { PAYMENT_STATUS, TRANSACTION_TYPE } from "../../utils/enums/payment";
import { MobilePayment } from "../../models/payments";

@Service()
export default class MobilePaymentRepository {
  async initializePayment(
    data: CreateMobilePaymentInput["body"] & {
      trxRef: string;
      transactionType: TRANSACTION_TYPE;
      partner: string;
      app: string;
    }
  ) {
    return await MobilePayment.create(data);
  }

  async updatePayment({
    trxRef,
    status,
    failMessage,
  }: {
    trxRef: string;
    status?: PAYMENT_STATUS;
    failMessage?: string;
  }) {
    await MobilePayment.findOneAndUpdate({ trxRef }, { status, failMessage });
  }

  async getPayment({ trxRef, ref }: { trxRef?: string; ref?: string }) {
    return await MobilePayment.findOne({
      $or: [{ trxRef }, { ref }],
    });
  }
}
