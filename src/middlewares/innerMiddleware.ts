import {Request, Response, NextFunction} from "express";
import {host} from "../common/host_config";
import {ErrorCodes} from "../common/error_codes";

export const innerMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    if (req.query.token) {
        const check_token = await fetch(`localhost:${host.AUTH}/auth/service`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_key: req.query.key,
                service_secret: req.query.secret,
                token: req.query.token
            })
        });

        if (check_token.status === 200) {
            return next();
        }

        const result = await check_token.json();

        if (result.body === ErrorCodes.NO_SUCH_SERVICE) {
            return res
                .status(401)
                .send(result.body)
        }

        if (result.body === ErrorCodes.TOKEN_EXPIRED) {
            return res
                .status(403)
                .send(result.body)
        }
    } else {
        const result = await fetch(`localhost:${host.AUTH}/auth/service`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_key: req.query.key,
                service_secret: req.query.secret,
            })
        });
        const body = result.json();
        if (result.status === 201) {
            return res
                .status(449)
                .send(body)
        }

        return res
            .status(401)
            .send(body)
    }
};

