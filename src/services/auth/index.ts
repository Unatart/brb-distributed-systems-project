import * as express from "express";
import * as bodyParser from "body-parser";
import {database} from "../../common/database";
import {createConnection} from "typeorm";
import {host} from "../../common/host_config";
import {Auth} from "./entity";
import {authRoutes} from "./routes";
import {AuthController} from "./controller";
import {AuthManager} from "./db_manager";

const app = express();
app.use(bodyParser.json());

const user_database = {...database, schema:"msg", entities: [Auth]};
createConnection(user_database).then(() => {
    const db_manager = new AuthManager(Auth);
    const controller = new AuthController(db_manager);
    authRoutes(app, controller);

    app.listen(host.AUTH, () => {
        console.log(`API AUTH running in http://localhost:${host.AUTH}`);
    });
});
