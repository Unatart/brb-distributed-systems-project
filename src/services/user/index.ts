import * as express from "express";
import * as bodyParser from "body-parser";
import {createConnection} from 'typeorm';
import {UserManager} from "./db_manager";
import {User} from "./entity";
import {UserController} from "./controller";
import {userRoutes} from "./routes";
import {database} from "../../common/database";

const app = express();
app.use(bodyParser.json());

const user_database = {...database, schema:"user", entities: [User]};
createConnection(user_database).then(() => {
    const user_db_manager = new UserManager(User);
    const user_controller = new UserController(user_db_manager);
    userRoutes(app, user_controller);
    app.listen(3001, () => {
        console.log(`API USER running in http://localhost:${3001}`);
    });
});
