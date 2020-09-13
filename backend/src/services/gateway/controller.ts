import {CommonController} from "../../common/common_controller";
import {GatewayManager} from "./db_manager";
import {Request, Response} from "express";
import {checkForErrors, getThroughMiddleware} from "../../helpers";
import {host} from "../../common/host_config";


export class GatewayController extends CommonController<GatewayManager> {
    public checkThirdPartyRegistration = async (req:Request, res: Response) => {
        try {
            const app_id = req.body.app_id || req.query.app_id;
            const app_secret = req.body.app_secret || req.query.app_secret;

            const result = await this.db_manager.checkRegistration(app_id, app_secret);

            console.log(result);
            return !!result;
        } catch (error) {
            return res
                .status(checkForErrors(error))
                .send(error.message);
        }
    }

    // 3RD PARTY APP
    public createCode = async (req:Request, res: Response) => {
        try  {
            const user_id = req.query.user_id as string;

            const app_id = req.body.app_id;
            const app_secret = req.body.app_secret;

            const result = await this.db_manager.createCode(user_id, app_id, app_secret);

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
                .status(checkForErrors(error))
                .send(error.message);
        }
    };

    public getToken = async (req: Request, res: Response) => {
        try {
            const app_id = req.query.app_id as string;
            const app_secret = req.query.app_secret as string;
            const grant_type = req.query.grant_type as string;

            if (grant_type === "auth_code") {
                const code = req.query.code as string;
                const result = await this.db_manager.createTokenForCode(code, app_id, app_secret);

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
                const result = await this.db_manager.refreshTokenForCode(app_id, app_secret, refresh_token);

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
                .status(checkForErrors(error))
                .send(error.message);
        }
    };

    public checkOauthToken = async (req:Request, res:Response) => {
        try {
            const user_id = req.body.user_id;
            const token = req.body.token;
            const app_id = req.body.app_id;

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
                .status(checkForErrors(error))
                .send(error.message);
        }
    };

    public getUserData = async (req:Request, res:Response) => {
        try {
            const user_id = req.params.id;
            const token = /<(.*?)>/.exec(req.header('authorization'))[1];
            const app_id = req.body.app_id || req.query.app_id;

            console.log(user_id, token, app_id);
            const result = this.db_manager.checkForOauth(user_id, app_id, token);

            if (result) {
                const user = await getThroughMiddleware(undefined, undefined, this.token, `${host.USER.port}/users/gateway/${user_id}`)

                if (user) {
                    this.token = user.token;

                    return res
                        .status(200)
                        .send(user)
                }

                return res
                    .status(400)
                    .send(user);
            }
        } catch (error) {
            return res
                .status(checkForErrors(error))
                .send(error.message);
        }
    };

    private token:string;
}
