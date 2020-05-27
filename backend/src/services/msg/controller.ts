import {CommonController} from "../../common/common_controller";
import {Request, Response} from "express";
import {ErrorCodes} from "../../common/error_codes";
import {MsgManager} from "./db_manager";
import {host} from "../../common/host_config";
import {createDate, getThroughMiddleware} from "../../helpers";
import {logInfo} from "../../common/logger";
import {Msg} from "./entity";
import {QueuesConfig} from "../../common/queue";


export class MsgController extends CommonController<MsgManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const guid = req.params.group_id;
            if (this.uuid_regex.test(guid)) {
                const messages:Msg[] = await this.db_manager.get(guid, +req.query.to, +req.query.from);
                if (messages.length) {
                    const ids:string[] = messages.map((record) => record.user_id);
                    const map = await getThroughMiddleware(undefined, undefined, this.token, `${host.USER.port}/convert_users`, { ids: ids });

                    const result = [];
                    for (let i = 0; i < messages.length; i++) {
                        result.push({
                            ...messages[i],
                            user_name: map[messages[i].user_id]
                        });
                    }

                    QueuesConfig.stat.push({
                        user_id: req.query.user_id as string,
                        service_name: host.MSG.name,
                        method: "GET",
                        time: createDate(),
                        body: req.body,
                        extra: "getMsg"
                    });

                    logInfo("Get msg", result);
                    return res
                        .status(200)
                        .send(result);
                }

                return res
                    .status(200)
                    .send([]);
            }
            logInfo("Get msg failed", ErrorCodes.UID_REGEX_MATCH, true);
            return res
                .status(400)
                .send(ErrorCodes.UID_REGEX_MATCH);
        } catch (error) {
            logInfo("Get msg failed", error.message, true);
            return res
                .status(404)
                .send(error.message);
        }
    };

    public set = async (req:Request, res:Response) => {
        try {
            const body = req.body;
            if (!this.uuid_regex.test(body.user_id) || !this.uuid_regex.test(body.group_id)) {
                logInfo("Set msg failed", ErrorCodes.UID_REGEX_MATCH, true);
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const group = await getThroughMiddleware(body.group_id, `${host.GROUP.port}/groups`, this.token);
            if (group.exist === true) {
                const result = await this.db_manager.set(body);

                QueuesConfig.stat.push({
                    user_id: req.query.user_id as string,
                    service_name: host.MSG.name,
                    method: "POST",
                    time: createDate(),
                    body: req.body,
                    extra: "setMsg"
                });

                logInfo("Set msg", result);

                return res
                    .status(200)
                    .send(result);
            }
            logInfo("Set msg failed", "Group didn't exist", true);
            return res
                .status(404)
                .send(group)
        } catch (error) {
            logInfo("Set msg failed", error.message, true);
            return res
                .status(404)
                .send(error.message);
        }
    };

    public update = async (req:Request, res:Response) => {
        try {
            const body = req.body;
            const user = await getThroughMiddleware(body.user_id, `${host.USER.port}/users`, this.token);
            this.token = user.token;
            if (user.exist === true) {
                const group = await getThroughMiddleware(body.group_id, `${host.GROUP.port}/groups`, this.token);
                if (group.exist === true) {
                    if (!this.uuid_regex.test(body.user_id) || !this.uuid_regex.test(body.group_id)) {
                        return res
                            .status(400)
                            .send(ErrorCodes.UID_REGEX_MATCH);
                    }

                    const result = await this.db_manager.update(req.params.id, body);

                    QueuesConfig.stat.push({
                        user_id: req.query.user_id as string,
                        service_name: host.MSG.name,
                        method: "PATCH",
                        time: createDate(),
                        body: req.body,
                        extra: "updateMsg"
                    });

                    logInfo("Update msg", result);
                    return res
                        .status(200)
                        .send(result);
                }
                logInfo("Update msg failed", "Group didn't exist", true);
                return res
                    .status(404)
                    .send(group)
            }
            logInfo("Update msg failed", "Group didn't exist", true);
            return res
                .status(404)
                .send(user)
        } catch (error) {
            logInfo("Update msg failed", error.message, true);
            return res
                .status(400)
                .send(error.message);
        }
    };

    public deleteByGroup = async (req:Request, res:Response) => {
        try {
            const result = await this.db_manager.delete(req.params.group_id);

            QueuesConfig.stat.push({
                user_id: req.query.user_id as string,
                service_name: host.MSG.name,
                method: "DELETE",
                time: createDate(),
                body: { group_id: req.params.group_id },
                extra: "deleteMsg"
            });

            logInfo(`Delete msgs by group id: ${req.params.group_id}`, result);

            return res
                .status(200)
                .send(result);
        } catch (error) {
            logInfo("Delete msgs failed", error.message, true);
            return res
                .status(400)
                .send(error.message);
        }
    };

    private token:string;
}
