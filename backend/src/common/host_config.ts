import {Request} from "express";

export const host = {
    AUTH: {
        port: 3000,
        name: "AUTH"
    },
    USER: {
        port: 3001,
        name: "USER"
    },
    MSG: {
        port: 3002,
        name: "MSG"
    },
    GROUP: {
        port: 3003,
        name: "GROUP"
    },
    STAT: {
        port: 3004,
        name: "STAT"
    },
    GATEWAY: {
        port: 3005,
        name: "GATEWAY"
    },
    SOCKET: {
        port: 3010
    }
};

export const allowedForGateway = {
    1: {
        path: "/users",
        method: "GET"
    },
}

export function isAllowed(req:Request):boolean {
    for (let key in allowedForGateway) {
        if (allowedForGateway[key].path === req.baseUrl && allowedForGateway[key].method === req.method) {
            return true;
        }
    }

    return false;
}


