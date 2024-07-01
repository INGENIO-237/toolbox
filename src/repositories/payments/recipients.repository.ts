import { Service } from "typedi";
import Recipient, { IRecipient } from "../../models/payments/recipients.model";

@Service()
export default class RecipientsRepo {
  async createRecipient(recipient: IRecipient) {
    return await Recipient.create(recipient);
  }

  async getRecipient({ phone }: { phone: string }) {
    return await Recipient.findOne({ phone });
  }
}
