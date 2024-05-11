import { Service } from "typedi";
import { CreatePaymentInput } from "../../schemas/payments";
import StripePayment, {
  StripeMetadata,
} from "../../models/payments/stripe.model";
import { PAYMENT_STATUS, TRANSACTION_TYPE } from "../../utils/enums/payment";

@Service()
export default class StripePaymentRepository {
  async initializePayment(
    data: CreatePaymentInput["body"] &
      StripeMetadata & {
        app: string;
      } & { transactionType: TRANSACTION_TYPE }
  ) {
    return await StripePayment.create(data);
  }

  async updatePayment({
    paymentIntent,
    status,
    receipt,
    failMessage,
  }: {
    paymentIntent: string;
    status?: PAYMENT_STATUS;
    receipt?: string;
    failMessage?: string;
  }) {
    await StripePayment.findOneAndUpdate(
      { paymentIntent },
      { status, receipt, failMessage }
    );
  }
}
