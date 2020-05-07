"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RedisSMQ = require("rsmq");
var Queue = /** @class */ (function () {
    function Queue() {
        this.name = "statistic_queue";
        console.log("construct");
        this.rsmq = new RedisSMQ({ host: "127.0.0.1", port: 6385, ns: "rsmq", realtime: true });
        this.rsmq.createQueue({ qname: this.name }, function (err, resp) {
            if (err) {
                if (err.name !== "queueExists") {
                    console.error(err);
                    return;
                }
                else {
                    console.log("queue exists.. resuming..");
                }
            }
            if (resp === 1) {
                console.log("queue created");
            }
        });
    }
    Queue.prototype.push = function (data) {
        console.log("TRYING TO SEND MSG");
        this.rsmq.sendMessage({ qname: this.name, message: JSON.stringify(data) }, function (error, res) {
            console.log("SEND");
            if (error) {
                // TODO: console.log -> normal logger
                console.error(error);
                return;
            }
            console.log("Message sent. ID:", res);
        });
    };
    Queue.prototype.pop = function (callback) {
        this.rsmq.popMessage({ qname: this.name }, function (error, res) {
            if (error) {
                console.error(error);
                return;
            }
            if ("message" in res && res.message) {
                console.log("Message received and deleted from queue, message: ", res.message);
                callback(JSON.parse(res.message));
            }
            else {
                console.log("No messages for me...");
                return;
            }
        });
    };
    return Queue;
}());
exports.queue = new Queue();
