import {Request, Response} from "express";
import {UserManager} from "./db_manager";
import {CommonController} from "../../common/common_controller";
import {ErrorCodes} from "../../common/error_codes";
import {queue} from "../../common/queue";
import {host} from "../../common/host_config";
import {createDate} from "../../helpers";
import {logInfo} from "../../common/logger";


export class UserController extends CommonController<UserManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            if (this.uuid_regex.test(id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            queue.push({
                user_id: req.query.user_id as string,
                service_name: host.USER.name,
                method: "GET",
                time: createDate(),
                body: req.body,
                extra: "getUser"
            });

            const result = await this.db_manager.get(id);

            logInfo("Get user", result);
            return res
                .status(200)
                .send(result);
        } catch (error) {
            logInfo("Get user failed", error.message, true);
            return res
                .status(404)
                .send(error.message);
        }
    };

    public getByNameAndPassword = async (req:Request, res:Response) => {
        try {
            const body = req.body;
            if (!this.username_regex.test(body.name)) {
                logInfo("Get by name and password failed", ErrorCodes.USERNAME_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.USERNAME_REGEX_MATCH);
            }
            if (!this.password_regex.test(body.password)) {
                logInfo("Get by name and password failed", ErrorCodes.PASSWORD_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.PASSWORD_REGEX_MATCH);
            }

            const result = await this.db_manager.getByNameAndPassword(body);
            if (result) {
                logInfo("Get by name and password", result, true);
                return res
                    .status(200)
                    .send(result);
            }

            logInfo("Get by name and password failed", ErrorCodes.NO_SUCH_USER, true);
            return res
                .status(404)
                .send(Error(ErrorCodes.NO_SUCH_USER));

        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    }

    public set = async (req:Request, res:Response) => {
        try {
            const body = req.body;
            if (!this.username_regex.test(body.name)) {
                logInfo("Set user failed", ErrorCodes.USERNAME_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.USERNAME_REGEX_MATCH);
            }
            if (!this.password_regex.test(body.password)) {
                logInfo("Set user failed", ErrorCodes.PASSWORD_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.PASSWORD_REGEX_MATCH);
            }

            const result = await this.db_manager.set(body);

            logInfo("Set user", result);
            return res
                .status(201)
                .send(result);
        } catch (error) {
            logInfo("Set user failed", error.message, true);
            return res
                .status(404)
                .send(error.message);
        }
    };

    public update = async (req:Request, res:Response) => {
        try {
            if (!this.uuid_regex.test(req.params.id)) {
                logInfo("Update user failed", ErrorCodes.UID_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            if (!this.password_regex.test(req.body.password)) {
                logInfo("Update user failed", ErrorCodes.PASSWORD_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.PASSWORD_REGEX_MATCH)
            }

            const result = await this.db_manager.update(req.params.id, req.body);

            queue.push({
                user_id: req.query.user_id as string,
                service_name: host.USER.name,
                method: "PATCH",
                time: createDate(),
                body: req.body,
                extra: "updateUser"
            });

            logInfo("Update user", result);
            return res
                .status(200)
                .send(result);
        } catch (error) {
            logInfo("Update user failed", error.message, true);
            return res
                .status(400)
                .send(error.message);
        }
    };

    public check = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            if (!this.uuid_regex.test(id)) {
                logInfo("Check user failed", ErrorCodes.UID_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = await this.db_manager.get(id);
            if (result && result.user_id) {
                logInfo("Check user", { exist: true });
                return res
                    .status(200)
                    .send({ exist: true });
            }

            logInfo("Check user", { exist: false }, true);
            return res
                .status(404)
                .send({ exist: false });
        } catch (error) {
            logInfo("Check user failed", error.message, true);
            return res
                .status(400)
                .send(error.message);
        }
    };

    /**
     * должен содержать хотя бы одну цифру,
     * хотя бы одну строчную лат. букву,
     * хотя бы одну прописную лат. букву,
     * и быть размером не меньше 8 символов
     */
    private password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    /**
     * должен включать в себя строчные и прописные латинские буквы, цифры, символы - и _,
     * и быть длинной от 6 до 32 символов
     */
    private username_regex = /^[a-zA-Z0-9_-]{6,32}$/;
}
