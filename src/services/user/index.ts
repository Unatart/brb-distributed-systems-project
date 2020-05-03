import * as express from "express";
import * as bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

import {ConnectionOptions, createConnection} from 'typeorm';
import {UserManager} from "./db_manager";
import {User} from "./entity";
import {UserController} from "./controller";
import {userRoutes} from "./routes";

export let database:ConnectionOptions;

if (process.env.NODE_ENV === 'develop') {
    database = {
        name: "develop",
        type: "postgres",
        host: "localhost",
        username: "unatart",
        password: "unatart",
        database: "brb_microservices",
        entities: ["src/services/*/entity/*.js"],
        logging: ["error"],
        synchronize: true
    }
}

const user_database = {...database, schema:"user", entities: [User]};
createConnection(user_database).then(() => {
    const user_db_manager = new UserManager(User);
    const user_controller = new UserController(user_db_manager);
    userRoutes(app, user_controller);
    app.listen(3001, () => {
        console.log(`API USER running in http://localhost:${3001}`);
    });
});
