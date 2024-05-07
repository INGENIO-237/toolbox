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

/**
 * @openapi
 * 
 * /sms/send:
 *  post:
 *    tags:
 *    - SMS
 *    summary: Send a sms
 *    security:
 *      - ApiKeyAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SendSms'
 *    responses:
 *      201:
 *        description: SMS sent
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to access this resource
 *      500:
 *        description: Internal Server Error
 */
SmsRouter.post(
  "/send",
  validate(sendSmsSchema),
  tryCatch(controller.sendSms.bind(controller))
);

export default SmsRouter;
