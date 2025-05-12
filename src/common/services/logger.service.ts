import { Injectable, LoggerService, Scope } from "@nestjs/common";
import { createLogger, format, Logger, transports } from "winston";

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  private context?: string;
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        format.errors({ stack: true }),
        format.json(),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, timestamp }) => {
              return `${timestamp} [${context}] ${level}: ${message}`;
            }),
          ),
        }),
        new transports.File({
          filename: "logs/error.log",
          level: "error",
        }),
        new transports.File({
          filename: "logs/combined.log",
        }),
      ],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: string) {
    this.logger.info(message, { context: this.context });
  }

  error(message: string, trace?: string) {
    this.logger.error(message, { context: this.context, trace });
  }

  warn(message: string) {
    this.logger.warn(message, { context: this.context });
  }

  debug(message: string) {
    this.logger.debug(message, { context: this.context });
  }

  verbose(message: string) {
    this.logger.verbose(message, { context: this.context });
  }
}
