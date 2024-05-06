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

AppsRouter.get("", tryCatch(controller.getApps.bind(controller)));
AppsRouter.post(
  "",
  validate(registerAppSchema),
  tryCatch(controller.registerApp.bind(controller))
);
AppsRouter.put(
  "/:appId",
  validate(updateAppShema),
  tryCatch(controller.updateApp.bind(controller))
);

export default AppsRouter;
