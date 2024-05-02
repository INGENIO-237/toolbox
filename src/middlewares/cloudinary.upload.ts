import { NextFunction, Request, Response } from "express";
import { uploader } from "../utils/cloudinary.utils";

export default async function uploadToCloudinary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const file = req.file;

    if (files) {
      const keys = Object.keys(files);

      for (let key of keys) {
        const fileList = files[key]; // Ex: logo: [{}, {}, ...]
        for (let file of fileList) {
          await uploader(req, file);
        }
      }
    }

    if (file) await uploader(req, file);

    return next();
  } catch (error) {
    return next(error);
  }
}

