import { Request, Response, NextFunction, json } from "express";

/**
 * When using server.use(express.json()) outside this condition, it parses the payload object
 * sent by stripe into a JavaScript object before it reaches our stripe/webhook handler.
 * Which causes our handler failing and providing this:
 *    `Webhook Error: Webhook payload must be provided as a string or a Buffer
 *    (https://nodejs.org/api/buffer.html) instance representing the _raw_ request
 *    body. Payload was provided as a parsed JavaScript object instead.
 *    Signature verification is impossible without access to the original signed material.`
 */
export default function parseBody() {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.originalUrl.includes("stripe/webhook")) {
      return json()(req, res, next);
    }

    return next();
  };
}
