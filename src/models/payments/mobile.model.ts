import { Schema, Types, model } from "mongoose";
import PaymentSchema, { PaymentDocument } from "./payment.model";
import { CountryCode } from "../../utils/enums/enums";
import { PartnerDocument } from "../partner.model";

type Provider = {
  name: string;
  country: CountryCode;
};

export interface MobilePaymentDocument extends PaymentDocument {
  partner: PartnerDocument["_id"];
  provider: Provider;
  phone: string;
}

const mobilePaymentSchema = PaymentSchema.discriminator(
  "MobilePayment",
  new Schema({
    partner: {
      type: Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    provider: {
      type: {
        name: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          enum: CountryCode,
        },
      },
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  })
);

const MobilePayment = model<MobilePaymentDocument>(
  "MobilePayment",
  mobilePaymentSchema
);

export default MobilePayment;
