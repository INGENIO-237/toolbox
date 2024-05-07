import { NextFunction, Request, Response } from "express";
import HTTP from "../utils/constants/http.responses";

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.locals.user) return res.sendStatus(HTTP.UNAUTHORIZED);

  return next();
}
