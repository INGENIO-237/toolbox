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

SessionRouter.post(
  "/login",
  validate(createSessionSchema),
  tryCatch(controller.createSession.bind(controller))
);
SessionRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  tryCatch(controller.forgotPassword.bind(controller))
);
SessionRouter.post(
  "/forgot-password-confirm",
  validate(forgotPasswordConfirmSchema),
  tryCatch(controller.forgotPasswordConfirm.bind(controller))
);
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
