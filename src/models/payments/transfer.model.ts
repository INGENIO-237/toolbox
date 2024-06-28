import { Schema, Types } from "mongoose";
import { RecipientDocument } from "../recipients.model";
import MobilePayment, { MobilePaymentDocument } from "./mobile.model";
import { TRANSACTION_TYPE } from "../../utils/enums/payment";

export interface TransferDocument extends MobilePaymentDocument {
  recipient: RecipientDocument["_id"];
}

const Transfer = MobilePayment.discriminator(
  "Transfer",
  new Schema({
    recipient: {
      type: Types.ObjectId,
      ref: "Recipient",
    },
    transactionType: {
      type: String,
      enum: TRANSACTION_TYPE,
      default: TRANSACTION_TYPE.CASHOUT,
    },
  })
);

export default Transfer;
