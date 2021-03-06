import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import moment from "moment";

function timeStampFormat() {
  return moment().format("YYYY-MM-DD HH:mm:ss.SSS ZZ");
}
//logger 설정
var logger = winston.createLogger({
  transports: [
    new winstonDaily({
      name: "info-file",
      filename: "./log/server",
      datePattern: "_yyyy-MM-dd.log",
      colorize: false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: "info",
      showLevel: true,
      json: false,
      timestamp: timeStampFormat,
    }),
    new winston.transports.Console({
      name: "debug-console",
      colorize: true,
      level: "debug",
      showLevel: true,
      json: false,
      timestamp: timeStampFormat,
    }),
  ],
  exceptionHandlers: [
    new winstonDaily({
      name: "exception-file",
      filename: "./log/exception",
      datePattern: "_yyyy-MM-dd.log",
      colorize: false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: "error",
      showLevel: true,
      json: false,
      timestamp: timeStampFormat,
    }),
    new winston.transports.Console({
      name: "exception-console",
      colorize: true,
      level: "debug",
      showLevel: true,
      json: false,
      timestamp: timeStampFormat,
    }),
  ],
});

export { logger };
