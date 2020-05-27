import { createLogger, format, transports } from "winston";
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: "backend.log",
            options: {
                flags: "a+"
            }
        })
    ]
});

const queue_logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: "queue.log",
            level: "info",
            options: {
                flags: "a+"
            }
        })
    ]
});

export function logInfo(msg:string, response?:any, error?:boolean) {
    let message = `${msg}.`;
    if (response) {
        message = `${msg}. Response: ${typeof response === "string" ? response : JSON.stringify(response)}.`
    }
    logger.log({
        level: error ? "error" : "info",
        message: message
    });
}

export function logQueue(msg:string) {
    queue_logger.log({
        level: "info",
        message: msg
    });
}
