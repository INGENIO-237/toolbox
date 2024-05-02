import { Express, Request, Response } from "express";
import SmsRoutes from "./routes/sms.routes";

export default function router(server: Express) {
  // Healthcheck endpoint
  server.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200)
  );

  //   API endpoints
  server.use("/api/sms", SmsRoutes);
}
