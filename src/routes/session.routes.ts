import "reflect-metadata";
import { Router } from "express";
import Container from "typedi";
import SessionController from "../controllers/session.controller";
import validate from "../middlewares/validate.request";
import {
  createSessionSchema,
  forgotPasswordConfirmSchema,
  forgotPasswordSchema,
  // resendOtpSchema,
} from "../schemas/session.schemas";
import { tryCatch } from "../utils/errors/errors.utils";
import isAuthenticated from "../middlewares/isAuthenticated";

const SessionRouter = Router();
const controller = Container.get(SessionController);

/**
 * @openapi
 *
 * /sessions/login:
 *  post:
 *    tags:
 *    - Sessions
 *    summary: Log user in
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *    responses:
 *      201:
 *        description: User logged in and tokens generated or OTP code generated and account needs to be verified
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginReturn'
 *      400:
 *        description: Bad Request
 *      500:
 *        description: Internal Server Error
 */
SessionRouter.post(
  "/login",
  validate(createSessionSchema),
  tryCatch(controller.createSession.bind(controller))
);

/**
 * @openapi
 * 
 * /sessions/forgot-password:
 *  post:
 *    tags:
 *    - Sessions
 *    summary: Request a password reset
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ForgotPassword'
 *    responses:
 *      200:
 *        description: OTP code has been generated and sent to the provided email address
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal Server Error
 */
SessionRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  tryCatch(controller.forgotPassword.bind(controller))
);

/**
 * @openapi
 * 
 * /sessions/forgot-password-confirm:
 *  post:
 *    tags:
 *    - Sessions
 *    summary: Reset password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ForgotPasswordConfirm'
 *    responses:
 *      200:
 *        description: Password reset
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Internal Server Error
 */
SessionRouter.post(
  "/forgot-password-confirm",
  validate(forgotPasswordConfirmSchema),
  tryCatch(controller.forgotPasswordConfirm.bind(controller))
);

/**
 * @openapi
 * 
 * /sessions/current:
 *  get:
 *    tags:
 *    - Sessions
 *    summary: Get currently logged in user's informations
 *    security:
 *      - BearerAuth: []
 *      - RefreshTokenAuth: []
 *    responses:
 *      200:
 *        description: Currently logged in user's informations
 *      401:
 *        description: Unauthorized to access this resource
 *      500:
 *        description: Internal Server Error
 */
SessionRouter.get(
  "/current",
  isAuthenticated,
  tryCatch(controller.getCurrentUser.bind(controller))
);
// SessionRouter.post(
//   "/resend-otp",
//   validate(resendOtpSchema),
//   tryCatch(controller.resendOtp.bind(controller))
// );

export default SessionRouter;
