import "reflect-metadata";

import { Router } from "express";
import { tryCatch } from "../utils/errors/errors.utils";
import Container from "typedi";
import PartnerController from "../controllers/partner.controller";
import validate from "../middlewares/validate.request";
import { createPartnerSchema } from "../schemas/partner.schemas";
// import isAuthenticated from "../middlewares/isAuthenticated";

const PartnersRouter = Router();
const controller = Container.get(PartnerController);

PartnersRouter.get(
  "",
  // isAuthenticated,
  tryCatch(controller.getPartners.bind(controller))
);
PartnersRouter.post(
  "",
  // isAuthenticated,
  validate(createPartnerSchema),
  tryCatch(controller.createPartner.bind(controller))
);

export default PartnersRouter;
