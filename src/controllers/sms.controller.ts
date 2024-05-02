import { Service } from "typedi";
import SmsService from "../services/sms.services";
import { Request, Response } from "express";
import { SendSMSInput } from "../schemas/sms.schemas";
import HTTP from "../utils/constants/http.responses";

@Service()
export default class SmsController {
  constructor(private service: SmsService) {}

  async sendSms(req: Request<{}, {}, SendSMSInput["body"]>, res: Response) {
    await this.service.sendSms(req.body);

    return res
      .status(HTTP.CREATED)
      .json({ message: "Message sent successfully" });
  }
}
