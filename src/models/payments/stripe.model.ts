import { Schema } from "mongoose";
import Payment, { PaymentDocument } from "./payment.model";

export type StripeMetadata = {
  paymentIntent: string;
};

export interface StripePaymentDocument extends PaymentDocument {
  paymentIntent: string;
  receipt?: string;
}

const StripePayment = Payment.discriminator<StripePaymentDocument>(
  "StripePayment",
  new Schema({
    paymentIntent: {
      type: String,
      required: true,
    },
    receipt: String,
    failMessage: String,
  })
);

export default StripePayment;
