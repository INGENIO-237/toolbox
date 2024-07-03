import "reflect-metadata";

import { Router } from "express";
import Container from "typedi";
import { MobilePaymentController } from "../../controllers/payments";
import validate from "../../middlewares/validate.request";
import {
  createMobilePaymentSchema,
  createMobileTransferSchema,
} from "../../schemas/payments";
import isTrustedApp from "../../middlewares/isTrustedApp";
import isAllowedService from "../../middlewares/isAllowedService";
import { tryCatch } from "../../utils/errors/errors.utils";
import { getPaymentSchema } from "../../schemas/payments/mobile.schemas";

const MobilePaymentRouter = Router();
const controller = Container.get(MobilePaymentController);

/**
 * @openapi
 * /payments/mobile:
 *  post:
 *    tags:
 *    - Mobile Payment
 *    summary: Initialize a mobile payment
 *    security:
 *      - ApiKeyAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/InitializeMobilePayment'
 *    responses:
 *      201:
 *        description: Payment Initialized
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to perform this action
 *      500:
 *        description: Internal Server Error
 */
MobilePaymentRouter.post(
  "",
  isTrustedApp,
  isAllowedService,
  validate(createMobilePaymentSchema),
  tryCatch(controller.initializePayment.bind(controller))
);

/**
 * @openapi
 * /payments/mobile/transfer:
 *  post:
 *    tags:
 *    - Mobile Payment
 *    summary: Perform a mobile transfer
 *    security:
 *      - ApiKeyAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/InitializeMobileTransfer'
 *    responses:
 *      201:
 *        description: Transfer Initialized
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to perform this action
 *      500:
 *        description: Internal Server Error
 */
MobilePaymentRouter.post(
  "/transfer",
  isTrustedApp,
  isAllowedService,
  validate(createMobileTransferSchema),
  tryCatch(controller.initializeTransfer.bind(controller))
);

// TODO: Document endpoint
MobilePaymentRouter.get(
  "/references/:reference",
  isTrustedApp,
  isAllowedService,
  validate(getPaymentSchema),
  tryCatch(controller.getPayment.bind(controller))
);

MobilePaymentRouter.post(
  "/webhook/:partner",
  tryCatch(controller.handleWebhook.bind(controller))
);

export default MobilePaymentRouter;
