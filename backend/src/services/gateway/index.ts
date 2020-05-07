import * as express from "express";
import * as bodyParser from "body-parser";
import {host} from "../../common/host_config";
import {Request, Response} from "express";
import * as request from "request-promise";
import {logInfo} from "../../common/logger";

const app = express();
app.use(bodyParser.json());

app.get("/users/:user_id", (req:Request, res:Response) => {
    return request({
        method: "GET",
        headers: req.headers,
        uri: `http://localhost:${host.USER.port}/users/${req.params.user_id}/?app_id=${req.query.app_id}`
    })
});

app.listen(host.GATEWAY.port, () => {
    logInfo(`API ${host.GATEWAY.name} running in http://localhost:${host.GATEWAY.port}`);
});
