import { Express, Request, Response } from "express";
import {
  AppsRouter,
  PartnersRouter,
  SessionRouter,
  SmsRouter,
  UsersRouter,
} from "./routes";
import HTTP from "./utils/constants/http.responses";
import StripePaymentRouter from "./routes/payments/stripe.routes";
import MobilePaymentRouter from "./routes/payments/mobile.routes";

export default function router(server: Express) {
  // Healthcheck endpoint
  server.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(HTTP.OK)
  );

  // API endpoints
  server.use("/api/apps", AppsRouter);
  server.use("/api/partners", PartnersRouter);
  server.use("/api/sessions", SessionRouter);
  server.use("/api/sms", SmsRouter);
  server.use("/api/payments/stripe", StripePaymentRouter);
  server.use("/api/payments/mobile", MobilePaymentRouter);
  server.use("/api/users", UsersRouter);
}
