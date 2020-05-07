import * as express from "express";
import * as bodyParser from "body-parser";
import {createConnection} from 'typeorm';
import {UserManager} from "./db_manager";
import {User} from "./entity";
import {UserController} from "./controller";
import {userRoutes} from "./routes";
import {database} from "../../common/database";
import {host} from "../../common/host_config";

const app = express();
app.use(bodyParser.json());

const user_database = {...database, schema:"user", entities: [User]};
createConnection(user_database).then(() => {
    const db_manager = new UserManager(User);
    const controller = new UserController(db_manager);
    userRoutes(app, controller);

    app.listen(host.USER.port, () => {
        console.log(`API ${host.USER.name} running in http://localhost:${host.USER.port}`);
    });
});
