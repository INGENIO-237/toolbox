import { Document, Schema, model } from "mongoose";
import { COUNTRY_CODE } from "../utils/enums/common";

export interface RecipientDocument extends Document {
  name: string;
  email?: string;
  phone: string;
  country: COUNTRY_CODE;
}

const recipientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      enum: [COUNTRY_CODE],
      default: COUNTRY_CODE.CM,
    },
    reference: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Recipient = model("Recipient", recipientSchema);

export default Recipient;
