import {innerMiddleware} from "../../middlewares/innerMiddleware";
import {outerMiddleware} from "../../middlewares/outerMiddleware";
import * as request from "request-promise";
import {host} from "../../common/host_config";
import {NextFunction, Request, Response} from "express";

export const userRoutes = (app, controller) => {
    // ---- private ----
    // -- ONLY AUTH PASS --

    app.post("/users", controller.set);

    app.get("/users/",  controller.getByNameAndPassword);
    // -- ONLY AUTH PASS FINISH

    app.get("/users/check/:id", innerMiddleware, controller.check);

    app.get("/users/check_many", innerMiddleware, controller.checkMany);

    app.get("/convert_users", innerMiddleware, controller.convertIds);

    // public

    app.get("/users/:id", oauthOuterMiddleware, controller.get);

    app.patch("/users/:id", outerMiddleware, controller.update);
};

const oauthOuterMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const app_id = req.query.app_id;
    if (app_id) {
        const token = /<(.*?)>/.exec(req.header('authorization'))[1];
        return request({
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
