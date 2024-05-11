import "reflect-metadata";

import { Router, raw } from "express";
import Container from "typedi";
import { StripePaymentController } from "../../controllers/payments";
import validate from "../../middlewares/validate.request";
import { createPaymentSchema } from "../../schemas/payments";
import isTrustedApp from "../../middlewares/isTrustedApp";
import isAllowedService from "../../middlewares/isAllowedService";

const StripePaymentRouter = Router();
const controller = Container.get(StripePaymentController);

/**
 * @openapi
 * /payments/stripe:
 *  post:
 *    tags:
 *    - Stripe Payment
 *    summary: Initialize a card payment via Stripe by requesting a payment intent
 *    security:
 *      - ApiKeyAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/InitializePayment'
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
StripePaymentRouter.post(
  "",
  isTrustedApp,
  isAllowedService,
  validate(createPaymentSchema),
  controller.initializePayment.bind(controller)
);

StripePaymentRouter.post(
  "/webhook",
  raw({ type: "application/json" }),
  controller.handleWebhook.bind(controller)
);

export default StripePaymentRouter;
