import "reflect-metadata";

import { Router } from "express";
import validate from "../middlewares/validate.request";
import { sendSmsSchema } from "../schemas/sms.schemas";
import Container from "typedi";
import SmsController from "../controllers/sms.controller";
import { tryCatch } from "../utils/errors/errors.utils";

const SmsRoutes = Router();
const controller = Container.get(SmsController);

SmsRoutes.post(
  "/send",
  validate(sendSmsSchema),
  tryCatch(controller.sendSms.bind(controller))
);

export default SmsRoutes