import * as express from "express";
import * as bodyParser from "body-parser";
import {createConnection} from 'typeorm';
import {database} from "../../common/database";
import {host} from "../../common/host_config";
import {MsgManager} from "./db_manager";
import {Msg} from "./entity";
import {MsgController} from "./controller";
import {msgRoutes} from "./routes";

const app = express();
app.use(bodyParser.json());

const user_database = {...database, schema:"msg", entities: [Msg]};
createConnection(user_database).then(() => {
    const db_manager = new MsgManager(Msg);
    const controller = new MsgController(db_manager);
    msgRoutes(app, controller);

    app.listen(host.MSG.port, () => {
        console.log(`API ${host.MSG.name} running in http://localhost:${host.MSG.port}`);
    });
});
