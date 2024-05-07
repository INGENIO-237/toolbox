import { Router } from "express";
import Container from "typedi";
import AppsController from "../controllers/apps.controller";
import validate from "../middlewares/validate.request";
import { registerAppSchema, updateAppShema } from "../schemas/apps.schemas";
import { tryCatch } from "../utils/errors/errors.utils";
import isAuthenticated from "../middlewares/isAuthenticated";

const AppsRouter = Router();

const controller = Container.get(AppsController);

AppsRouter.use(isAuthenticated);

/**
 * @openapi
 *
 * /apps:
 *  get:
 *    tags:
 *    - Apps
 *    summary: Get list of trusted apps
 *    security:
 *      - BearerAuth: []
 *      - RefreshTokenAuth: []
 *    responses:
 *      200:
 *        description: List of trusted apps
 *      401:
 *        description: Unauthorized to access this resource
 *      500:
 *        description: Internal Server Error
 */
AppsRouter.get("", tryCatch(controller.getApps.bind(controller)));

/**
 * @openapi
 *
 * /apps:
 *  post:
 *    tags:
 *    - Apps
 *    summary: Register an app
 *    security:
 *      - BearerAuth: []
 *      - RefreshTokenAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterApp'
 *    responses:
 *      201:
 *        description: App registered
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to perform this action
 *      500:
 *        description: Internal Server Error
 */
AppsRouter.post(
  "",
  validate(registerAppSchema),
  tryCatch(controller.registerApp.bind(controller))
);

/**
 * @openapi
 *
 * /apps/{appId}:
 *  put:
 *    tags:
 *    - Apps
 *    summary: Update a given app
 *    security:
 *      - BearerAuth: []
 *      - RefreshTokenAuth: []
 *    parameters:
 *      - in: path
 *        name: appId
 *        type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateApp'
 *    responses:
 *      200:
 *        description: App updated
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Unauthorized to perform this action
 *      500:
 *        description: Internal Server Error
 */
AppsRouter.put(
  "/:appId",
  validate(updateAppShema),
  tryCatch(controller.updateApp.bind(controller))
);

export default AppsRouter;
