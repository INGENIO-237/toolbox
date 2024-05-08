import "reflect-metadata";

import { Router } from "express";
import { tryCatch } from "../utils/errors/errors.utils";
import Container from "typedi";
import PartnerController from "../controllers/partner.controller";
import validate from "../middlewares/validate.request";
import {
  createPartnerSchema,
  updatePartnerSchema,
} from "../schemas/partner.schemas";
import isAuthenticated from "../middlewares/isAuthenticated";

const PartnersRouter = Router();
const controller = Container.get(PartnerController);

PartnersRouter.use(isAuthenticated);

/**
 * @openapi
 *
 * /partners:
 *  get:
 *    tags:
 *    - Partners
 *    summary: Get list of partners
 *    security:
 *      - BearerAuth: []
 *      - RefreshTokenAuth: []
 *    responses:
 *      200:
 *        description: List of partners
 *      401:
 *        description: Unauthorized to access this resource
 *      500:
 *        description: Internal Server Error
 */
PartnersRouter.get("", tryCatch(controller.getPartners.bind(controller)));

/**
 * @openapi
 *
 * /partners:
 *  post:
 *    tags:
 *    - Partners
 *    summary: Register a partner
 *    security:
 *      - BearerAuth: []
 *      - RefreshTokenAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterPartner'
 *    responses:
 *      201:
 *        description: Partner registered
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to perform this action
 *      500:
 *        description: Internal Server Error
 */
PartnersRouter.post(
  "",
  validate(createPartnerSchema),
  tryCatch(controller.createPartner.bind(controller))
);

/**
 * @openapi
 * 
 * /partners/{partnerId}:
 *  put:
 *    tags:
 *    - Partners
 *    summary: Update a given partner
 *    security:
 *      - BearerAuth: []
 *      - RefreshTokenAuth: []
 *    parameters:
 *      - in: path
 *        name: partnerId
 *        required: true
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdatePartner'
 *    responses:
 *      200:
 *        description: Partner updated
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to perform this action
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal Server Error
 */
PartnersRouter.put(
  "/:partnerId",
  validate(updatePartnerSchema),
  tryCatch(controller.updatePartner.bind(controller))
);

export default PartnersRouter;
