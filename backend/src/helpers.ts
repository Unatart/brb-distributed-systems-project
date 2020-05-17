import {host} from "./common/host_config";
import * as request from "request-promise";

export const getThroughMiddleware = async (id:string, substring:string, token:string, begin_url?:string, body?:any) => {
    const uri = begin_url ||`${substring}/check/${id}`
    const full_uri = `${uri}/?token=${token}&key=${process.env.KEY}&secret=${process.env.SECRET}`;

    return request({
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        uri: `http://localhost:${full_uri}`,
        json: true,
        body: body
    })
        .then((response) => ({ ...response, token: token }))
        .catch((error) => {
            const status = error.message.slice(0, 3);
            const res_body = error.message.slice(6);
            const token = JSON.parse(res_body).token;
            switch (status) {
                case "449":
                    return request({
                        method: "GET",
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
                            method: "GET",
                            headers: { 'Content-Type': 'application/json' },
                            uri: `http://localhost:${uri}/?token=${response.token}&key=${process.env.KEY}&secret=${process.env.SECRET}`,
                            json: true,
                            body: body
                        }).then((retry_response) => ({...retry_response, token: response.token}));
                    });
            }
    });
};

export function createDate(db?:boolean):string {
    let d = new Date();
    if (db) {
        d.setMinutes(d.getMinutes() + 30);
    }
    return d.toISOString().split("").slice(0, 10).join("") + " " + d.toISOString().split("").slice(11, 19).join("");
}
