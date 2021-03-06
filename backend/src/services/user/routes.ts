import {innerMiddleware} from "../../middlewares/innerMiddleware";
import {outerMiddleware} from "../../middlewares/outerMiddleware";
import * as request from "request-promise";
import {host} from "../../common/host_config";
import {NextFunction, Request, Response} from "express";

export const userRoutes = (app, controller) => {
    app.get("/users/:id", oauthOuterMiddleware, controller.get);

    app.patch("/users/:id", outerMiddleware, controller.update);

    // ---- private ----
    // -- ONLY AUTH PASS --
    app.post("/users/", controller.set);

    app.get("/users/",  controller.getByNameAndPassword);
    // -- ONLY AUTH PASS FINISH

    app.get("/users/check/:id", innerMiddleware, controller.check);
};

const oauthOuterMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const app_id = req.query.app_id;
    const token = /<(.*?)>/.exec(req.header('authorization'))[1];
    if (app_id) {
        request({
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            body: {
                user_id: req.params.user_id,
                app_id: req.query.app_id,
                token: token
            },
            uri: `http://localhost:${host.AUTH.port}/oauth/`,
            json: true
        })
            .then(() => next())
            .catch((error) => res.status(401).send(error.message));
    } else {
        return outerMiddleware(req, res, next);
    }
}
