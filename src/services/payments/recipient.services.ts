import { Service } from "typedi";
import RecipientsRepo from "../../repositories/payments/recipients.repository";
import { IRecipient } from "../../models/payments/recipients.model";

@Service()
export default class RecipientServices {
  constructor(private repository: RecipientsRepo) {}

  async createRecipient(recipient: IRecipient) {
    return await this.repository.createRecipient(recipient);
  }

  async getRecipient({ phone }: { phone: string }) {
    return await this.repository.getRecipient({ phone });
  }
}
