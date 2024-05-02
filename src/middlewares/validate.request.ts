import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import {
  logError,
  schemaValidationErrorParser,
} from "../utils/errors/errors.utils";
import HTTP from "../utils/constants/http.responses";
import { removeTempImages } from "../utils/cloudinary.utils";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    // if (req.files) {
    //   const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    //   console.log({
    //     files: files["mainImage"],
    //   });
    // }

    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        files: req.files,
        file: req.file,
      });

      return next();
    } catch (error: any) {
      logError(error);

      // Clean images/videos uploaded
      removeTempImages(req);

      return res
        .status(HTTP.BAD_REQUEST)
        .json(schemaValidationErrorParser(error));
    }
  };

export default validate;
