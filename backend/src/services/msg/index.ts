import * as express from "express";
import * as bodyParser from "body-parser";
import {createConnection} from 'typeorm';
import {database} from "../../common/database";
import {host} from "../../common/host_config";
import {MsgManager} from "./db_manager";
import {Msg} from "./entity";
import {MsgController} from "./controller";
import {msgRoutes} from "./routes";
import {logInfo} from "../../common/logger";
import cors = require('cors');
import {QueuesConfig} from "../../common/queue";

const app = express();
app.use(bodyParser.json());

app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', "Access-Control-Allow-Credentials", "Content-Type"],
    credentials: true,
    origin: true
}));

const user_database = {...database, schema:"msg", entities: [Msg]};
createConnection(user_database).then(() => {
    const db_manager = new MsgManager(Msg);
    const controller = new MsgController(db_manager);
    msgRoutes(app, controller);

    app.listen(host.MSG.port, () => {
        logInfo(`API ${host.MSG.name} running in http://localhost:${host.MSG.port}`);
        setInterval(() => QueuesConfig.msg.pop(db_manager.delete), 60000);
    });
});
