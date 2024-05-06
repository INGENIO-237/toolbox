import "reflect-metadata";

import { Router } from "express";
import validate from "../middlewares/validate.request";
import { sendSmsSchema } from "../schemas/sms.schemas";
import Container from "typedi";
import SmsController from "../controllers/sms.controller";
import { tryCatch } from "../utils/errors/errors.utils";
import isTrustedApp from "../middlewares/isTrustedApp";
import isAllowedService from "../middlewares/isAllowedService";

const SmsRouter = Router();
const controller = Container.get(SmsController);

SmsRouter.use(isTrustedApp);
SmsRouter.use(isAllowedService);

SmsRouter.post(
  "/send",
  validate(sendSmsSchema),
  tryCatch(controller.sendSms.bind(controller))
);

export default SmsRouter;
