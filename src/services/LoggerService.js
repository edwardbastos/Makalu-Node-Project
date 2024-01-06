import winston from "winston";
import config from "../config/config.js";

export default class LoggerService {
  constructor(env) {
    this.winston_levels = {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5,
    };
    this.logger = this.createLogger(env);
  }

  createLogger = (env) => {
    switch (config.app.LOGGER_ENV) {
      case "development":
        return winston.createLogger({
          levels: this.winston_levels,
          transports: [
            new winston.transports.Console({
              level: "debug",
              format: winston.format.simple(),
            }),
            new winston.transports.File({
              filename: "./errorsDev.log",
              level: "error",
            }),
          ],
        });

      case "production":
        return winston.createLogger({
          levels: this.winston_levels,
          transports: [
            new winston.transports.Console({ level: "info" }),
            new winston.transports.File({
              level: "warning",
              filename: "./errors.log",
            }),
          ],
        });
    }
  };
}
