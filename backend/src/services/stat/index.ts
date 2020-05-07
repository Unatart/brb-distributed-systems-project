import * as express from "express";
import * as bodyParser from "body-parser";
import {createConnection} from 'typeorm';
import {database} from "../../common/database";
import {host} from "../../common/host_config";
import {StatManager} from "./db_manager";
import {Stat} from "./entity";
import {StatController} from "./controller";
import {statRoutes} from "./routes";
import {queue} from "../../common/queue";
import {logInfo} from "../../common/logger";

const app = express();
app.use(bodyParser.json());

const user_database = {...database, schema:"stat", entities: [Stat]};
createConnection(user_database).then(() => {
    const db_manager = new StatManager(Stat);
    const controller = new StatController(db_manager);
    statRoutes(app, controller);

    app.listen(host.STAT.port, () => {
        logInfo(`API ${host.STAT.name} running in http://localhost:${host.STAT.port}`);
        setInterval(() => {
            queue.pop(controller.set);
        }, 5000);
    });
});
