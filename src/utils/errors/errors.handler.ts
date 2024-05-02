import { NextFunction, Request, Response } from "express";
import { BaseError } from "./errors.base";
import logger from "../logger";
import HTTP from "../constants/http.responses";

export default function errorHandler(
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error);
  return error.isOperationalError
    ? res.status(error.statusCode).json([{ message: error.message }])
    : res.status(HTTP.INTERNAL_SERVER_ERROR).json([
        {
          message:
            "Something went wrong. Retry later. If it persists, please contact service support.",
        },
      ]);
}
