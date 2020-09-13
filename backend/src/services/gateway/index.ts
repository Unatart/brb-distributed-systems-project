import * as express from "express";
import * as bodyParser from "body-parser";
import {host} from "../../common/host_config";
import {logInfo} from "../../common/logger";
import cors = require('cors');
import {database} from "../../common/database";
import {ThirdApp} from "./entity";
import {createConnection} from "typeorm";
import {gatewayRoutes} from "./routes";
import {GatewayManager} from "./db_manager";
import {GatewayController} from "./controller";

const app = express();
app.use(bodyParser.json());

app.use(cors({
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', "Access-Control-Allow-Credentials", "Content-Type"],
    credentials: true,
    origin: true
}));

const third_app_database = {...database, schema:"gateway", entities: [ThirdApp]};

createConnection(third_app_database).then(() => {
    const db_manager = new GatewayManager(ThirdApp);
    const controller = new GatewayController(db_manager);
    gatewayRoutes(app, controller);

    app.listen(host.GATEWAY.port, () => {
        logInfo(`API ${host.GATEWAY.name} running in http://localhost:${host.GATEWAY.port}`);
    });
});
