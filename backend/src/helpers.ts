import {host} from "./common/host_config";
import * as request from "request-promise";
import {ErrorCodes} from "./common/error_codes";

export const getThroughMiddleware = async (
    id:string | undefined,
    substring:string | undefined,
    token:string,
    begin_url?:string,
    body?:any,
    method?:string
):Promise<any> => {
    const uri = begin_url ||`${substring}/check/${id}`
    const full_uri = `${uri}/?token=${token}&key=${process.env.KEY}&secret=${process.env.SECRET}`;

    return request({
        method: method || "GET",
        headers: { 'Content-Type': 'application/json' },
        uri: `http://localhost:${full_uri}`,
        json: true,
        body: body
    })
        .then((response) => ({ ...response, token: token }))
        .catch((error) => {
            const status = error.message.slice(0, 3);
            if (status === "Err") {
                throw Error(ErrorCodes.SERVICE_UNAVAILABLE);
            }
            const res_body = error.message.slice(6);
            const token = JSON.parse(res_body).token;
            switch (status) {
                case "449":
                    return request({
                        method: method || "GET",
                        headers: { 'Content-Type': 'application/json' },
                        uri: `http://localhost:${uri}/?token=${token}&key=${process.env.KEY}&secret=${process.env.SECRET}`,
                        json: true,
                        body: body
                    }).then((response) => ({ ...response, token: token}))
                case "403":
                    return request({
                        method: "PATCH",
                        headers: { 'Content-Type': 'application/json' },
                        body: {
                            key: process.env.KEY,
                            secret: process.env.SECRET
                        },
                        uri: `http://localhost:${host.AUTH.port}/auth/service/`,
                        json: true
                    }).then((response) => {
                        request({
                            method: method || "GET",
                            headers: { 'Content-Type': 'application/json' },
                            uri: `http://localhost:${uri}/?token=${response.token}&key=${process.env.KEY}&secret=${process.env.SECRET}`,
                            json: true,
                            body: body
                        }).then((retry_response) => ({ ...retry_response, token: response.token }))
                    })
            }
    });
};

export function createDate(db?:boolean):string {
    let d = new Date();
    d.setHours(d.getHours() + 3);
    if (db) {
        d.setMinutes(d.getMinutes() + 30);
    }
    return d.toISOString().split("").slice(0, 10).join("") + " " + d.toISOString().split("").slice(11, 19).join("");
}

export function checkForErrors(error:Error) {
    switch (error.message) {
        case ErrorCodes.THIRD_PARTY_NOT_ALLOWED:
        case ErrorCodes.SERVICE_UNAVAILABLE:
        case ErrorCodes.ERROR_403:
        case ErrorCodes.ADMIN_ALLOWED:
            return 403;
        case ErrorCodes.INCORRECT_AUTHORIZATION:
        case ErrorCodes.REQUIRE_TOKEN_AND_UID:
        case ErrorCodes.TOKEN_EXPIRED:
            return 401;
        default:
            return 400;
    }
}
