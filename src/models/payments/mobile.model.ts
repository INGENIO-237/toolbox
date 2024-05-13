import { Schema, Types, model } from "mongoose";
import PaymentSchema, { PaymentDocument } from "./payment.model";
import { COUNTRY_CODE } from "../../utils/enums/common";
import { PartnerDocument } from "../partner.model";

export type Provider = {
  name: string;
  country: COUNTRY_CODE;
};

export interface MobilePaymentDocument extends PaymentDocument {
  partner: PartnerDocument["_id"];
  provider: Provider;
  phone: string;
  trxRef: string;
}

const MobilePayment = PaymentSchema.discriminator<MobilePaymentDocument>(
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
          enum: COUNTRY_CODE,
        },
      },
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    trxRef: {
      type: String,
      required: true,
    },
  })
);

export default MobilePayment;
