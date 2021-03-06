import {Request, Response, NextFunction} from "express";
import {ErrorCodes} from "../common/error_codes";
import * as request from "request-promise";
import {host, isAllowed} from "../common/host_config";

export const outerMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const token = /<(.*?)>/.exec(req.header('authorization'))[1];
    const user_id = req.query.user_id;
    const app_id = req.query.app_id;
    if (token && user_id) {
        if (app_id && isAllowed(req)) {
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
        }
        return request({
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            uri: `http://localhost:${host.AUTH.port}/auth/user/${user_id}/?token=${token}`
        })
            .then(() => next())
            .catch((error) => res.status(401).send(error.message));
    }

    return res
        .status(401)
        .send(Error(ErrorCodes.REQUIRE_TOKEN_AND_UID));
};
