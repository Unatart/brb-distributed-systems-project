import {CommonController} from "../../common/common_controller";
import {AuthManager} from "./db_manager";
import {Request, Response} from "express";
import {host} from "../../common/host_config";
import {ErrorCodes} from "../../common/error_codes";
import * as request from "request-promise";

export class AuthController extends CommonController<AuthManager> {
    public signOut = async (req:Request, res:Response) => {
        try {
            const user_res = await request({
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: req.body,
                uri: `http://localhost:${host.USER}/users/`,
                json: true
            }).catch((error) => {
                return res
                    .status(400)
                    .send(error.message);
            });

            const result = await this.db_manager.create(user_res);

            return res
                .status(201)
                .send(result)
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public signIn = async (req:Request, res:Response) => {
        try {
            const user_res = await request({
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                body: req.body,
                uri: `http://localhost:${host.USER}/users/`,
                json: true
            }).catch((error) => {
                return res
                    .status(404)
                    .send(error.message);
            });

            const result = await this.db_manager.update(user_res.user_id);

            return res
                .status(200)
                .send(result);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    }

    public checkToken = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            const token = req.query.token as string;
            if (!this.uuid_regex.test(id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = await this.db_manager.checkAndUpdate(id, token);

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
            const result = await this.db_manager.serviceCreate(
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
            const result = await this.db_manager.serviceCheck(
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
            const result = await this.db_manager.serviceUpdate(
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

