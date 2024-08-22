import { Request, Response } from "express";
import { Service } from "typedi";
import { CreatePaymentInput } from "../../schemas/payments";
import HTTP from "../../utils/constants/http.responses";
import { StripePaymentService } from "../../services/payments";

@Service()
export default class StripePaymentController {
  constructor(private service: StripePaymentService) {}

  async initializePayment(
    req: Request<{}, {}, CreatePaymentInput["body"]>,
    res: Response
  ) {
    const { amount, currency } = req.body;
    const app = res.locals.app.id as string;

    const initializedPayment = await this.service.initializePayment({
      amount,
      currency,
      app,
    });

    return res.status(HTTP.CREATED).json(initializedPayment);
  }

  async handleWebhook(req: Request, res: Response) {
    const signature = req.headers["stripe-signature"] as string | string[];

    await this.service.handlePaymentHook(signature, req.body);

    return res.sendStatus(HTTP.OK);
  }
}
