import * as express from "express";
import * as bodyParser from "body-parser";
import {database} from "../../common/database";
import {createConnection} from "typeorm";
import {host} from "../../common/host_config";
import {Auth} from "./entity";
import {authRoutes} from "./routes";
import {AuthController} from "./controller";
import {AuthManager} from "./db_manager";
import {logInfo} from "../../common/logger";
import cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', "Access-Control-Allow-Credentials", "Content-Type"],
    credentials: true,
    origin: true
}));

const user_database = {...database, schema:"auth", entities: [Auth]};
createConnection(user_database).then(() => {
    const db_manager = new AuthManager(Auth);
    const controller = new AuthController(db_manager);
    authRoutes(app, controller);

    app.listen(host.AUTH.port, () => {
        logInfo(`API ${host.AUTH.name} running in http://localhost:${host.AUTH.port}`);
    });
});
