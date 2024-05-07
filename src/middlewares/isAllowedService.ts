import { NextFunction, Request, Response } from "express";
import { AllowedServices } from "../types/enums";
import HTTP from "../utils/constants/http.responses";

export default function isAllowedService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const allowedServices = res.locals.allowedServices;

  if (allowedServices === AllowedServices.both) {
    return next();
  }

  const requestedService = req.originalUrl.split("/")[2];

  if (requestedService !== allowedServices) {
    return res
      .status(HTTP.FORBIDDEN)
      .json([{ message: "You are not allowed to access this resource" }]);
  }

  return next();
}
