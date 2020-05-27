import * as RedisSMQ from "rsmq";
import {IStat} from "../services/stat/entity";
import {logQueue} from "./logger";

export interface IQueue {
    push(data:IStat):void;
    pop(callback:(message:IStat) => Promise<void>):void;
}

class Queue implements IQueue {
    constructor(private port?:number, private name?:string) {
        logQueue("Create queue...");
        this.rsmq = new RedisSMQ({host: "127.0.0.1", port: this.port, ns: "rsmq", realtime: true});
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

    public push(data:any) {
        this.rsmq.sendMessage({qname: this.name, message: JSON.stringify(data)}, (error, res) => {
            if (error) {
                logQueue(error);
                return;
            }

            logQueue(`Message sent. ID: ${res}.`);
        });
    }

    public pop(callback:(message:any) => Promise<any>) {
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
}

export const QueuesConfig = {
    stat: new Queue(6379, "statistic_queue"),
    msg: new Queue(6380, "msg")
};
