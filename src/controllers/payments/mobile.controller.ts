import { Request, Response } from "express";
import { Service } from "typedi";
import {
  CreateMobilePaymentInput,
  CreateMobileTransferInput,
} from "../../schemas/payments";
import { MobilePaymentService } from "../../services/payments";
import { ACCOUNT_MODE } from "../../utils/enums/common";
import HTTP from "../../utils/constants/http.responses";
import { PARTNERS } from "../../utils/enums/payment";
import { GetPayment } from "../../schemas/payments/mobile.schemas";

@Service()
export default class MobilePaymentController {
  constructor(private service: MobilePaymentService) {}

  async initializePayment(
    req: Request<{}, {}, CreateMobilePaymentInput["body"]>,
    res: Response
  ) {
    const { ref: reference, authorization_url } =
      await this.service.initializePayment({
        ...req.body,
        mode: res.locals.mode as ACCOUNT_MODE,
        app: res.locals.app,
      });

    return res.status(HTTP.CREATED).json({ reference, authorization_url });
  }

  async initializeTransfer(
    req: Request<{}, {}, CreateMobileTransferInput["body"]>,
    res: Response
  ) {
    const reference = await this.service.initializeTransfer({
      ...req.body,
      mode: res.locals.mode as ACCOUNT_MODE,
      app: res.locals.app,
    });

    return res.status(HTTP.CREATED).json({ reference });
  }

  async handleWebhook(req: Request, res: Response) {
    const partner = req.params.partner.toUpperCase();

    let signature;

    if (partner == PARTNERS.NOTCHPAY)
      signature = req.headers["x-notch-signature"];

    await this.service.handleWebhook({
      partner,
      signature: signature as string,
      data: req.body,
    });

    return res.sendStatus(HTTP.OK);
  }

  async getPayment(req: Request<GetPayment["params"]>, res: Response) {
    const payment = await this.service.getPayment({
      reference: req.params.reference,
    });

    return res.status(HTTP.OK).json(payment);
  }
}
