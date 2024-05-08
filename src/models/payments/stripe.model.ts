import { Schema, model } from "mongoose";
import PaymentSchema, { PaymentDocument } from "./payment.model";

export interface StripePaymentDocument extends PaymentDocument {
  clientSecret: string;
}

const stripeSchema = PaymentSchema.discriminator(
  "StripePayment",
  new Schema({
    clientSecret: {
      type: String,
      required: true,
    },
  })
);

const StripePayment = model<StripePaymentDocument>(
  "StripePayment",
  stripeSchema
);

export default StripePayment;
