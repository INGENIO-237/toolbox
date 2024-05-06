import { Express, Request, Response } from "express";
import { AppsRouter, PartnersRouter, SmsRouter } from "./routes";

export default function router(server: Express) {
  // Healthcheck endpoint
  server.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200)
  );

  // API endpoints
  server.use("/api/apps", AppsRouter);
  server.use("/api/partners", PartnersRouter);
  server.use("/api/sms", SmsRouter);
}
