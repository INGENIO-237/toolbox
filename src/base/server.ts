import express, { NextFunction, Request, Response } from "express";
import connectToDatabase from "./db";
import router from "../router";
import errorHandler from "../../utils/errors/errors.handler";
import { deserializeUser } from "../../middlewares/session";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";

export default function createServer() {
  const server = express();

  connectToDatabase();

  server.use(cors());

  server.use(express.json());
  // server.use(express.urlencoded({ extended: false }));
  server.use(deserializeUser);

  // server.use((req: Request, res: Response, next: NextFunction) => {
  //   console.log({
  //     type: req.headers["content-type"],
  //     body: req.body,
  //     files: req.files,
  //     file: req.file,
  //   });
  // });

  cloudinary.config({
    api_key: config.CLOUDINARY_API_KEY as string,
    api_secret: config.CLOUDINARY_API_SECRET as string,
    cloud_name: config.CLOUDINARY_API_CLOUD_NAME as string,
    secure: true,
  });

  router(server);

  server.use(errorHandler);

  return server;
}
