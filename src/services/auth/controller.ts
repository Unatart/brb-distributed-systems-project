import {CommonController} from "../../common/common_controller";
import {AuthManager} from "./db_manager";
import {Request, Response} from "express";
import {host} from "../../common/host_config";
import {ErrorCodes} from "../../common/error_codes";

export class AuthController extends CommonController<AuthManager> {
    public signOut = async (req:Request, res:Response) => {
        try {
            const user_res = await fetch(`localhost:${host.USER}/users/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: req.body
            });

            const body = await user_res.json();
            if (user_res.status === 201) {
                const result = this.db_manager.create(body);

                return res
                    .status(201)
                    .send(result)
            }

            return res
                .status(user_res.status)
                .send(body);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public signIn = async (req:Request, res:Response) => {
        try {
            const user_res = await fetch(`localhost:${host.USER}/users/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: req.body
            });

            const body = await user_res.json();
            if (user_res.status === 201) {
                const result = this.db_manager.update(body.user_id);

                return res
                    .status(200)
                    .send(result);
            }

            return res
                .status(user_res.status)
                .send(body);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    }

    public updateToken = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            if (!this.uuid_regex.test(id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = this.db_manager.update(id);

            return res
                .status(200)
                .send(result);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public createTokenForService = async (req:Request, res:Response) => {
        try {
            const result = this.db_manager.serviceCreate(
                req.body.service_key,
                req.body.service_secret
            );

            return res
                .status(201)
                .send(result);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public checkTokenForService = async (req:Request, res:Response) => {
        try {
            const result = this.db_manager.serviceCheck(
                req.body.service_key,
                req.body.service_secret,
                req.body.token
            );

            return res
                .status(200)
                .send(result);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public updateTokenForService = async (req:Request, res:Response) => {
        try {
            const result = this.db_manager.serviceUpdate(
                req.body.service_key,
                req.body.service_secret,
            );

            return res
                .status(200)
                .send(result);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };
}

