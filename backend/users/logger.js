import { createLogger, transports, format } from "winston";
const { combine, printf } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let log = `${timestamp}[${level}]: ${message}`;

    if (metadata) {
        log += JSON.stringify(metadata);
    }

    return log;
});

const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({
            level: "warn",
            filename: "./logs/logsWarnings.log"
        }),
        new transports.File({
            level: "error",
            filename: "./logs/logsErrors.log"
        }),
    ],

    format: combine(
        format.json(),
        format.timestamp(),
        format.colorize(),
        myFormat
    ),
});

export default logger;