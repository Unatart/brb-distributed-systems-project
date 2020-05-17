import * as express from "express";
import * as bodyParser from "body-parser";
import {createConnection} from 'typeorm';
import {database} from "../../common/database";
import {host} from "../../common/host_config";
import {Group} from "./entity";
import {groupRoutes} from "./routes";
import {GroupManager} from "./db_manager";
import {GroupController} from "./controller";
import {logInfo} from "../../common/logger";
import cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', "Access-Control-Allow-Credentials", "Content-Type"],
    credentials: true,
    origin: true
}));

const user_database = {...database, schema:"group", entities: [Group]};
createConnection(user_database).then(() => {
    const db_manager = new GroupManager(Group);
    const controller = new GroupController(db_manager);
    groupRoutes(app, controller);

    app.listen(host.GROUP.port, () => {
        logInfo(`API ${host.GROUP.name} running in http://localhost:${host.GROUP.port}`);
    });
});
