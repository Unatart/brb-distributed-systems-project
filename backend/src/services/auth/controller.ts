import {CommonController} from "../../common/common_controller";
import {AuthManager} from "./db_manager";
import {Request, Response} from "express";
import {host} from "../../common/host_config";
import {ErrorCodes} from "../../common/error_codes";
import * as request from "request-promise";
import {createDate} from "../../helpers";
import {logInfo} from "../../common/logger";
import {QueuesConfig} from "../../common/queue";

export class AuthController extends CommonController<AuthManager> {
    // USER
    public signUp = async (req:Request, res:Response) => {
        try {
            const user_res = await request({
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: req.body,
                uri: `http://localhost:${host.USER.port}/users/`,
                json: true
            }).catch((error) => {
                return res
                    .status(400)
                    .send(error.message);
            });

            const result = await this.db_manager.create(user_res);
            QueuesConfig.stat.push({
                user_id: result.user_id,
                service_name: host.AUTH.name,
                method: "POST",
                time: createDate(),
                body: req.body,
                extra: "signOut"
            });

            logInfo("Sign out user", result);
            return res
                .status(201)
                .send(result)
        } catch (error) {
            logInfo("Sign out user failed", error.message, true);
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
                uri: `http://localhost:${host.USER.port}/users/`,
                json: true
            })
            .catch((error) => {
                console.log("catch error", error.message);
                return res
                    .status(404)
                    .send(error.message);
            });

            const result = await this.db_manager.update(user_res.user_id);

            QueuesConfig.stat.push({
                user_id: result.user_id,
                service_name: host.AUTH.name,
                method: "POST",
                time: createDate(),
                body: req.body,
                extra: "signIn"
            });

            logInfo("Sign in user", result);
            return res
                .status(200)
                .send(result);
        } catch (error) {
            logInfo("Sign in user failed", error.message, true);
            return res
                .status(404)
                .send(error.message);
        }
    }

    public checkToken = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            const token = req.query.token as string;
            const admin = req.query.admin === "true";

            if (!this.uuid_regex.test(id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = await this.db_manager.checkAndUpdate(id, token, admin);

            QueuesConfig.stat.push({
                user_id: id,
                service_name: host.AUTH.name,
                method: "GET",
                time: createDate(),
                body: req.body,
                extra: "checkToken"
            });

            logInfo("Check token", result);
            return res
                .status(200)
                .send(result);
        } catch (error) {
            logInfo("Check token failed", error.message, true);
            return res
                .status(404)
                .send(error.message);
        }
    };

    // SERVICE
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
                .status(403)
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
                .status(403)
                .send(error.message);
        }
    };

    // 3RD PARTY APP
    public createCode = async (req:Request, res: Response) => {
        try  {
            const client_id = req.body.client_id;
            const client_secret = req.body.client_secret;
            const user_id = req.body.user_id;
            const token = /<(.*?)>/.exec(req.header('authorization'))[1];

            const result = await this.db_manager.createCode(user_id, client_id, client_secret, token);

            if (result) {
                return res
                    .status(200)
                    .send(result);
            }

            return res
                .status(401)
                .send(result);
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public getToken = async (req: Request, res: Response) => {
        try {
            const client_id = req.query.client_id as string;
            const client_secret = req.query.client_secret as string;
            const grant_type = req.query.grant_type as string;

            if (grant_type === "auth_code") {
                const code = req.query.code as string;
                const result = await this.db_manager.createTokenForCode(code, client_id, client_secret);

                if (result) {
                    return res
                        .status(200)
                        .send(result);
                }
                return res
                    .status(401)
                    .send(result);
            }

            if (grant_type === "refresh_token") {
                const refresh_token = req.query.refresh_token as string;
                const result = await this.db_manager.refreshTokenForCode(client_id, client_secret, refresh_token);

                if (result) {
                    return res
                        .status(200)
                        .send(result);
                }
                return res
                    .status(401)
                    .send(result);
            }
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public checkOauthToken = async (req:Request, res:Response) => {
        try {
            const user_id = req.body.user_id;
            const token = req.body.token;
            const app_id = req.body.app_id;
            console.log(app_id, token, user_id);

            const result = await this.db_manager.checkForOauth(user_id, app_id, token);

            if (result) {
                return res
                    .status(200)
                    .send(result);
            }
            return res
                .status(401)
                .send(result);
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };
}

