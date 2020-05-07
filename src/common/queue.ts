import * as RedisSMQ from "rsmq";
import {IStat} from "../services/stat/entity";

class Queue {
    constructor() {
        console.log("construct");
        this.rsmq = new RedisSMQ({host: "127.0.0.1", port: 6385, ns: "rsmq", realtime: true});
        this.rsmq.createQueue({ qname: this.name }, (err, resp) => {
            if (err) {
                if (err.name !== "queueExists") {
                    console.error(err);
                    return;
                } else {
                    console.log("queue exists.. resuming..");
                }
            }
            if (resp === 1) {
                console.log("queue created")
            }
        });
    }

    public push(data:IStat) {
        console.log("TRYING TO SEND MSG");
        this.rsmq.sendMessage({qname: this.name, message: JSON.stringify(data)}, (error, res) => {
            console.log("SEND");
            if (error) {
                // TODO: console.log -> normal logger
                console.error(error);
                return;
            }

            console.log("Message sent. ID:", res);
        });
    }

    public pop(callback) {
        this.rsmq.popMessage({qname: this.name}, function (error, res) {
            if (error) {
                console.error(error);
                return;
            }

            if ("message" in res && res.message) {
                console.log("Message received and deleted from queue, message: ", res.message);
                callback(JSON.parse(res.message));
            } else {
                console.log("No messages for me...");
                return;
            }
        });
    }

    private rsmq:RedisSMQ;
    private name:string = "statistic_queue";
}

export const queue = new Queue();
