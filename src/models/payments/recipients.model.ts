import { InferSchemaType, Schema, model } from "mongoose";
import config from "../../config";

export const recipientSchema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: config.DEFAULT_RECIPIENT_EMAIL,
  },
  reference: {
    type: String,
    required: true,
  },
});

export type IRecipient = InferSchemaType<typeof recipientSchema>;

const Recipient = model<IRecipient>("Recipient", recipientSchema);

export default Recipient;
