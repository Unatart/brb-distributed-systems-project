import {CommonController} from "../../common/common_controller";
import {Request, Response} from "express";
import {ErrorCodes} from "../../common/error_codes";
import {MsgManager} from "./db_manager";
import {host} from "../../common/host_config";
import {createDate, getThroughMiddleware} from "../../helpers";
import {queue} from "../../common/queue";
import {logInfo} from "../../common/logger";

export class MsgController extends CommonController<MsgManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const uuid = req.params.user_id;
            const guid = req.params.group_id;
            if (this.uuid_regex.test(uuid) && this.uuid_regex.test(guid)) {
                const result = await this.db_manager.get(uuid, guid);

                queue.push({
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

            const user = await getThroughMiddleware(body.user_id, `${host.USER.port}/users`, this.token);
            this.token = user.token;
            if (user.exist === true) {
                const group = await getThroughMiddleware(body.group_id, `${host.GROUP.port}/groups`, this.token);
                if (group.exist === true) {
                    const result = await this.db_manager.set(body);

                    queue.push({
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
            }
            logInfo("Set msg failed", "User didn't exist", true);
            return res
                .status(404)
                .send(user)
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

                    queue.push({
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

    private token:string;
}
