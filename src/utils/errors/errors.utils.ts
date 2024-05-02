import { NextFunction, Request, Response } from "express";
import logger from "../logger";
import { BaseError } from "./errors.base";

export function tryCatch(handler: Function) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

export function logError(error: BaseError) {
  logger.error(error);
}

export function schemaValidationErrorParser(validationError: any) {
  const errors = [...validationError.errors];

  return errors.map((error) => {
    return { message: error.message };
  });
}
