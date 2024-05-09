import { Document, Schema, Types } from "mongoose";
import { PAYMENT_STATUS, SUPPORTED_CURRENCIES, TRANSACTION_TYPE } from "../../utils/enums/payment";
import { AppDocument } from "../apps.model";
import { v4 } from "uuid";

export interface PaymentDocument extends Document {
  ref: string;
  app: AppDocument["_id"];
  amount: number;
  currency: string;
  status: PAYMENT_STATUS;
  transactionType: TRANSACTION_TYPE;
  providerRef?: string;
}

const PaymentSchema = new Schema(
  {
    ref: String,
    app: {
      type: Types.ObjectId,
      ref: "App",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: SUPPORTED_CURRENCIES.XAF,
      enum: SUPPORTED_CURRENCIES
    },
    status: {
      type: String,
      default: PAYMENT_STATUS.INITIALIZED,
      enum: PAYMENT_STATUS,
    },
    transactionType: {
      type: String,
      required: true,
      enum: TRANSACTION_TYPE,
    },
    providerRef: String,
  },
  { timestamps: true }
);

PaymentSchema.pre<PaymentDocument>("save", function (next) {
  const doc = this;

  if (doc.isNew) {
    doc.ref = "ref-" + v4().toString();
  }

  next();
});

export default PaymentSchema;
