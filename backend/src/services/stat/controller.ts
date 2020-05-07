import {CommonController} from "../../common/common_controller";
import {Request, Response} from "express";
import {StatManager} from "./db_manager";
import {IStat} from "./entity";

export class StatController extends CommonController<StatManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const count = +req.query.count > 0
                ? +req.query.count
                : undefined;
            const service_name = req.query.service_name as string !== "undefined"
                ? req.query.service_name as string
                : undefined;
            const result = await this.db_manager.get(count, service_name);

            return res
                .status(200)
                .send(result);
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public set = async (msg:IStat) => {
        await this.db_manager.set(msg);
    }
}
