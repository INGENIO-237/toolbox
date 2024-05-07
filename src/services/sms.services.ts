import { Service } from "typedi";
import { SendSMSInput } from "../schemas/sms.schemas";
import TwilioService from "./twilio.service";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../utils/constants/http.responses";
import isValidPhoneNumber from "../utils/phone";

@Service()
export default class SmsService {
  constructor(private service: TwilioService) {}

  async sendSms({ recipient, message }: SendSMSInput["body"]) {
    if (!isValidPhoneNumber(recipient)) {
      throw new ApiError("Invalid phone number", HTTP.BAD_REQUEST);
    }
    
    await this.service.sendSms({ recipient, message });
  }
}
