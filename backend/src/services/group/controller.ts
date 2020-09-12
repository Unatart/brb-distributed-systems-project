import {CommonController} from "../../common/common_controller";
import {Request, Response} from "express";
import {ErrorCodes} from "../../common/error_codes";
import {GroupManager} from "./db_manager";
import {host} from "../../common/host_config";
import {checkForErrors, createDate, getThroughMiddleware} from "../../helpers";
import {logInfo} from "../../common/logger";
import * as _ from "underscore";
import {User} from "../user/entity";
import {QueuesConfig} from "../../common/queue";
import {messageCircuitBreaker} from "./routes";

export class GroupController extends CommonController<GroupManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            if (this.uuid_regex.test(id)) {
                const result = await this.db_manager.getByUserId(id);
                QueuesConfig.stat.push({
                    user_id: req.query.user_id as string,
                    service_name: host.GROUP.name,
                    method: "GET",
                    time: createDate(),
                    body: req.body,
                    extra: "getGroup"
                });

                logInfo("Get groups by user_id", result);
                return res
                    .status(200)
                    .send(result);
            }
            logInfo("Get group failed", ErrorCodes.UID_REGEX_MATCH, true);
            return res
                .status(400)
                .send(ErrorCodes.UID_REGEX_MATCH);
        } catch (error) {
            logInfo("Get group failed", error.message, true);
            return res
                .status(404)
                .send(error.message);
        }
    };

    public getMembers = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            if (this.uuid_regex.test(id)) {
                const result = await this.db_manager.getMembers(id);
                QueuesConfig.stat.push({
                    user_id: req.query.user_id as string,
                    service_name: host.GROUP.name,
                    method: "GET",
                    time: createDate(),
                    body: req.body,
                    extra: "getGroupMembers"
                });

                logInfo("Get group members", result);
                return res
                    .status(200)
                    .send(result);
            }
            logInfo("Get group members failed", ErrorCodes.UID_REGEX_MATCH, true);
            return res
                .status(400)
                .send(ErrorCodes.UID_REGEX_MATCH);
        } catch (error) {
            logInfo("Get group failed", error.message, true);
            return res
                .status(404)
                .send(error.message);
        }
    };

    public set = async (req:Request, res:Response) => {
        try {
            const users = await getThroughMiddleware(req.body.user_id, undefined, this.token, `${host.USER.port}/users/check_many`, req.body);
            this.token = users.token;
            if (users) {
                const ids:string[] = _.map(users, (user:User) => user.user_id).slice(0, -1);

                const result = await this.db_manager.set(req.body.name, ids);

                QueuesConfig.stat.push({
                    user_id: req.query.user_id as string,
                    service_name: host.GROUP.name,
                    method: "POST",
                    time: createDate(),
                    body: req.body,
                    extra: "setGroup"
                });

                logInfo("Set group", result);
                return res
                    .status(201)
                    .send(result);
            }

            logInfo("Set group failed", users, true);
            return res
                .status(400)
                .send(users)
        } catch (error) {
            logInfo("Set group failed", error.message, true);
            return res
                .status(checkForErrors(error))
                .send(error.message);
        }
    };

    public update = async (req:Request, res:Response) => {
        try {
            if (!this.uuid_regex.test(req.params.id)) {
                logInfo("Update group failed", ErrorCodes.UID_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = await this.db_manager.update(req.params.id, req.body);

            QueuesConfig.stat.push({
                user_id: req.query.user_id as string,
                service_name: host.GROUP.name,
                method: "PATCH",
                time: createDate(),
                body: req.body,
                extra: "updateGroup"
            });

            logInfo("Update group", result);
            return res
                .status(200)
                .send(result);
        } catch (error) {
            logInfo("Update group failed", error.message, true);
            return res
                .status(checkForErrors(error))
                .send(error.message);
        }
    };

    public delete = async (req:Request, res:Response) => {
        try {
            if (!this.uuid_regex.test(req.params.id)) {
                logInfo("Delete group failed", ErrorCodes.UID_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const group = await Promise.resolve(messageCircuitBreaker.middleware())
                .then(() => getThroughMiddleware(
                        undefined,
                        undefined,
                        this.token,
                        `${host.MSG.port}/msg/${req.params.id}`,
                        undefined,
                        "DELETE"))
                .catch(async () => {
                    QueuesConfig.msg.push(req.params.id);
                    messageCircuitBreaker.upTry();
                    const result = await this.db_manager.delete(req.params.id);
                    QueuesConfig.stat.push({
                        user_id: req.query.user_id as string,
                        service_name: host.GROUP.name,
                        method: "DELETE",
                        time: createDate(),
                        body: req.body,
                        extra: "deleteGroup without messages"
                    });

                    logInfo("Delete group without messages", result);
                    return res
                        .status(200)
                        .send(result);
                });

            if (group.token) {
                const result = await this.db_manager.delete(req.params.id);
                QueuesConfig.stat.push({
                    user_id: req.query.user_id as string,
                    service_name: host.GROUP.name,
                    method: "DELETE",
                    time: createDate(),
                    body: req.body,
                    extra: "deleteGroup"
                });

                logInfo("Delete group", req.params.id);
                return res
                    .status(200)
                    .send(result);
            }
        } catch (error) {
            logInfo("Delete group failed", error.message, true);
            return res
                .status(checkForErrors(error))
                .send(error.message);
        }
    };

    public check = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            if (this.uuid_regex.test(id)) {
                const result = await this.db_manager.get(id);

                if (result && result.name) {
                    return res
                        .status(200)
                        .send({ exist: true });
                }

                return res
                    .status(404)
                    .send({ exist: false });
            }
            return res
                .status(400)
                .send(ErrorCodes.UID_REGEX_MATCH);
        } catch (error) {
            return res
                .status(checkForErrors(error))
                .send(error.message);
        }
    };

    private token:string;
}
