import "reflect-metadata";

import { Router } from "express";
import validate from "../middlewares/validate.request";
import { sendSmsSchema } from "../schemas/sms.schemas";
import Container from "typedi";
import SmsController from "../controllers/sms.controller";
import { tryCatch } from "../utils/errors/errors.utils";
import isTrustedApp from "../middlewares/isTrustedApp";

const SmsRouter = Router();
const controller = Container.get(SmsController);

SmsRouter.post(
  "/send",
  isTrustedApp,
  validate(sendSmsSchema),
  tryCatch(controller.sendSms.bind(controller))
);

export default SmsRouter;
