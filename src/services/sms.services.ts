import { Service } from "typedi";
import { SendSMSInput } from "../schemas/sms.schemas";
import TwilioService from "./twilio.service";

@Service()
export default class SmsService {
  constructor(private service: TwilioService) {}

  async sendSms({ recipient, message }: SendSMSInput["body"]) {
    await this.service.sendSms({ recipient, message });
  }
}
