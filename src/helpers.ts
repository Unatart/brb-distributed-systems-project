import {host} from "./common/host_config";

export const getThroughMiddleware = async (id:string, substring:string, token:string) => {
    const response = await fetch(`localhost:${substring}/check/${id}/?token=${token}&key=${process.env.KEY}&secret=${process.env.SECRET}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    });

    const body = await response.json();

    switch (response.status) {
        case 200:
            return {
                ...body,
                token: token
            };
        case 449: {
            const response_retry = await fetch(`localhost:${substring}/check/${id}/?token=${body.token}&key=${process.env.KEY}&secret=${process.env.SECRET}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response_retry.status === 200) {
                return {
                    ...body,
                    token: body.token
                };
            }
            break;
        }
        case 403: {
            const auth = await fetch(`localhost:${host.AUTH}/auth/service/`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: process.env.KEY,
                    secret: process.env.SECRET
                })
            });

            const auth_response = await auth.json();
            if (auth.status === 200) {
                const user_response_retry = await fetch(`localhost:${substring}/check/${id}/?token=${auth_response.token}&key=${process.env.KEY}&secret=${process.env.SECRET}`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (user_response_retry.status === 200) {
                    return {
                        ...body,
                        token: auth_response.token
                    };
                }
            }
        }
    }
};
