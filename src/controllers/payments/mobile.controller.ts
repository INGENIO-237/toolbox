import { Request, Response } from "express";
import { Service } from "typedi";
import { CreateMobilePaymentInput } from "../../schemas/payments";
import { MobilePaymentService } from "../../services/payments";
import { ACCOUNT_MODE } from "../../utils/enums/common";
import HTTP from "../../utils/constants/http.responses";

@Service()
export default class MobilePaymentController {
  constructor(private service: MobilePaymentService) {}

  async initializePayment(
    req: Request<{}, {}, CreateMobilePaymentInput["body"]>,
    res: Response
  ) {
    const paymentRef = await this.service.initializePayment({
      ...req.body,
      mode: res.locals.mode as ACCOUNT_MODE,
      app: res.locals.app,
    });

    return res.status(HTTP.CREATED).json({ paymentRef });
  }
}
