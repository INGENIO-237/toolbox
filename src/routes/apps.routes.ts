import { Router } from "express";
import Container from "typedi";
import AppsController from "../controllers/apps.controller";
// import isAuthenticated from "../middlewares/isAuthenticated";
import validate from "../middlewares/validate.request";
import { registerAppSchema } from "../schemas/apps.schemas";
import { tryCatch } from "../utils/errors/errors.utils";

const AppsRouter = Router();

const controller = Container.get(AppsController);

AppsRouter.get(
  "",
  // isAuthenticated,
  tryCatch(controller.getApps.bind(controller))
);
AppsRouter.post(
  "",
  // isAuthenticated,
  validate(registerAppSchema),
  tryCatch(controller.registerApp.bind(controller))
);

export default AppsRouter;
