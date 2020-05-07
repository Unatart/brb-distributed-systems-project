import {Request, Response, NextFunction} from "express";
import {host} from "../common/host_config";
import * as request from "request-promise";

export const innerMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    if (req.query.token !== "undefined") {
        return request({
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_key: req.query.key,
                service_secret: req.query.secret,
                token: req.query.token
            }),
            uri: `http://localhost:${host.AUTH.port}/auth/service`
        }).then(() => next());
    } else {
        return request({
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: {
                service_key: req.query.key,
                service_secret: req.query.secret,
            },
            uri: `http://localhost:${host.AUTH.port}/auth/service`,
            json: true
        }).then((result) => res.status(449).send(result))
    }
};

