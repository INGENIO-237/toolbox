import { Express, Request, Response } from "express";
import SmsRouter from "./routes/sms.routes";
import AppsRouter from "./routes/apps.routes";

export default function router(server: Express) {
  // Healthcheck endpoint
  server.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200)
  );

  //   API endpoints
  server.use("/api/apps", AppsRouter);
  server.use("/api/sms", SmsRouter);
}
