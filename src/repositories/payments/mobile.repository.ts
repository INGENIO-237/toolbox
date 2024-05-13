import { Service } from "typedi";
import { CreateMobilePaymentInput } from "../../schemas/payments";
import { TRANSACTION_TYPE } from "../../utils/enums/payment";
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
}
