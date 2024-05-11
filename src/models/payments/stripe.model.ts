import { Schema } from "mongoose";
import PaymentSchema, { PaymentDocument } from "./payment.model";

export type StripeMetadata = {
  paymentIntent: string;
  clientSecret: string;
};

export interface StripePaymentDocument extends PaymentDocument {
  paymentIntent: string;
  clientSecret: string;
}

const StripePayment = PaymentSchema.discriminator<StripePaymentDocument>(
  "StripePayment",
  new Schema({
    paymentIntent: {
      type: String,
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
  })
);

export default StripePayment;
