import express from "express";
import connectToDatabase from "./db";
import router from "../router";
import errorHandler from "../utils/errors/errors.handler";
import { deserializeUser } from "../middlewares/session";
import cors from "cors";
import swaggerDocs from "../docs/swagger";

export default function createServer() {
  const server = express();

  connectToDatabase();

  server.use(cors());

  server.use(express.json());
  // server.use(express.urlencoded({ extended: false }));
  server.use(deserializeUser);

  swaggerDocs(server);
  router(server);

  server.use(errorHandler);

  return server;
}
