import {Request, Response} from "express";

export abstract class CommonController<T> {
    constructor(init_db_manager) {
        this.db_manager = init_db_manager;
    }

    protected abstract get(req:Request, res:Response);
    protected abstract set(req:Request, res:Response);
    protected abstract update(req:Request, res:Response);

    protected db_manager:T;
    protected uuid_regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
}
