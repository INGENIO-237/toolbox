import { Service } from "typedi";
import { CreatePaymentInput } from "../../schemas/payments";
import StripePayment, {
  StripeMetadata,
} from "../../models/payments/stripe.model";
import { TRANSACTION_TYPE } from "../../utils/enums/payment";

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
}
