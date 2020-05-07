import {host} from "./common/host_config";
import * as request from "request-promise";

export const getThroughMiddleware = async (id:string, substring:string, token:string) => {
    return request({
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        uri: `http://localhost:${substring}/check/${id}/?token=${token}&key=${process.env.KEY}&secret=${process.env.SECRET}`,
        json: true
    })
        .then((response) => ({ ...response, token: token }))
        .catch((error) => {
            const status = error.message.slice(0, 3);
            const body = JSON.parse(error.message.slice(6));
            switch (status) {
                case "449":
                    return request({
                        method: "GET",
                        headers: { 'Content-Type': 'application/json' },
                        uri: `http://localhost:${substring}/check/${id}/?token=${body.token}&key=${process.env.KEY}&secret=${process.env.SECRET}`,
                        json:true
                    }).then((response) => ({ ...response, token: body.token}))
                case "403":
                    return request({
                        method: "PATCH",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            key: process.env.KEY,
                            secret: process.env.SECRET
                        }),
                        uri: `http://localhost:${host.AUTH.port}/auth/service/`,
                        json: true
                    }).then((response) => {
                        request({
                            method: "GET",
                            headers: { 'Content-Type': 'application/json' },
                            uri: `http://localhost:${substring}/check/${id}/?token=${response.token}&key=${process.env.KEY}&secret=${process.env.SECRET}`,
                            json: true
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
