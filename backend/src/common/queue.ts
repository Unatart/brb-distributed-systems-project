import * as RedisSMQ from "rsmq";
import {IStat} from "../services/stat/entity";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, prettyPrint } = format;

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

function logQueue(msg:string) {
    queue_logger.log({
        level: "info",
        message: msg
    });
}

class Queue {
    constructor() {
        logQueue("Create queue...");
        this.rsmq = new RedisSMQ({host: "127.0.0.1", port: 6385, ns: "rsmq", realtime: true});
        this.rsmq.createQueue({ qname: this.name }, (error, resp) => {
            if (error) {
                if (error.name !== "queueExists") {
                    logQueue(error);
                    return;
                } else {
                    logQueue("Queue exists.. resuming..");
                }
            }
            if (resp === 1) {
                logQueue("Queue created.")
            }
        });
    }

    public push(data:IStat) {
        this.rsmq.sendMessage({qname: this.name, message: JSON.stringify(data)}, (error, res) => {
            if (error) {
                logQueue(error);
                return;
            }

            logQueue(`Message sent. ID: ${res}.`);
        });
    }

    public pop(callback) {
        this.rsmq.popMessage({qname: this.name}, function (error, res) {
            if (error) {
                logQueue(error);
                return;
            }

            if ("message" in res && res.message) {
                logQueue(`Message received and deleted from queue, message: ${res.message}.`);
                callback(res.message);
            } else {
                logQueue("No messages for me...");
                return;
            }
        });
    }

    private rsmq:RedisSMQ;
    private name:string = "statistic_queue";
}

export const queue = new Queue();
