import { Express, Request, Response } from "express";
import { AppsRouter, PartnersRouter, SmsRouter } from "./routes";
import isTrustedApp from "./middlewares/isTrustedApp";
import isAllowedService from "./middlewares/isAllowedService";
import HTTP from "./utils/constants/http.responses";

export default function router(server: Express) {
  // Healthcheck endpoint
  server.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(HTTP.OK)
  );

  // API endpoints
  server.use("/api/apps", AppsRouter);
  server.use("/api/partners", PartnersRouter);
  // server.use("/api/sms", SmsRouter);
  server.get(
    "/api/payments",
    isTrustedApp,
    isAllowedService,
    (req: Request, res: Response) => {
      return res.sendStatus(HTTP.OK);
    }
  );
}
