import {CommonController} from "../../common/common_controller";
import {Request, Response} from "express";
import {ErrorCodes} from "../../common/error_codes";
import {MsgManager} from "./db_manager";

export class MsgController extends CommonController<MsgManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const uuid = req.params.user_id;
            const guid = req.params.group_id;
            if (this.uuid_regex.test(uuid) && this.uuid_regex.test(guid)) {
                const result = await this.db_manager.get(uuid, guid);

                return res
                    .status(200)
                    .send(result);
            }
            return res
                .status(400)
                .send(ErrorCodes.UID_REGEX_MATCH);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public set = async (req:Request, res:Response) => {
        try {
            const body = req.body;
            if (!this.uuid_regex.test(body.name.user_id) || !this.uuid_regex.test(body.name.group_id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = await this.db_manager.set(body);

            return res
                .status(200)
                .send(result);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public update = async (req:Request, res:Response) => {
        try {
            const body = req.body;
            if (!this.uuid_regex.test(body.name.user_id) || !this.uuid_regex.test(body.name.group_id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = await this.db_manager.update(req.params.id, body);

            return res
                .status(200)
                .send(result);
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };
}
