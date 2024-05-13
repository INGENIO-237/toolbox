import "reflect-metadata";

import { NextFunction, Request, Response } from "express";
import HTTP from "../utils/constants/http.responses";
import Container from "typedi";
import AppsService from "../services/apps.services";

export default function isTrustedApp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res
      .status(HTTP.UNAUTHORIZED)
      .json([{ message: "You are not allowed to access this resource" }]);
  }

  const appService = Container.get(AppsService);

  appService
    .getApp({ apiKey: apiKey as string })
    .then((trustedApp) => {
      if (!trustedApp || trustedApp.hasBeenDeleted) {
        return res
          .status(HTTP.UNAUTHORIZED)
          .json([{ message: "You are not allowed to access this resource" }]);
      }

      res.locals.allowedServices = trustedApp.allowedServices as string;
      res.locals.app = trustedApp._id.toString();
      res.locals.mode = trustedApp.mode;

      return next();
    })
    .catch((error) => {
      throw error;
    });
}
