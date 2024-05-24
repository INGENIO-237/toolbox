import { createLogger, format, transports } from "winston";
import { ENV } from "./enums/common";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "toolbox-error.log", level: "error" }),
    new transports.File({ filename: "toolbox-combined.log" }),
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.APP_ENV !== ENV.PRODUCTION) {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
