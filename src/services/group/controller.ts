import {CommonController} from "../../common/common_controller";
import {Request, Response} from "express";
import {ErrorCodes} from "../../common/error_codes";
import {GroupManager} from "./db_manager";

export class GroupController extends CommonController<GroupManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const id = req.params.id;
            if (this.uuid_regex.test(id)) {
                const result = await this.db_manager.get(id);

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
            // TODO: check if users exist
            const result = await this.db_manager.set(req.body);

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
            // TODO: check if users exist
            if (!this.uuid_regex.test(req.body.name.group_id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = await this.db_manager.update(req.params.id, req.body);

            return res
                .status(200)
                .send(result);
        } catch (error) {
            return res
                .status(400)
                .send(error.message);
        }
    };

    public delete = async (req:Request, res:Response) => {
        try {
            if (!this.uuid_regex.test(req.params.id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            const result = await this.db_manager.delete(req.params.id);

            return res
                .status(200)
                .send(result)
        } catch (error) {
            return res
                .status(400)
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
                .status(404)
                .send(error.message);
        }
    };
}
