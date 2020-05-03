import {Request, Response} from "express";
import {UserManager} from "./db_manager";
import {CommonController} from "../../common/common_controller";


export class UserController extends CommonController<UserManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const user_uuid = req.params.id;
            if (this.uuid_regex.test(user_uuid)) {

                const result = await this.db_manager.get(req.params.id);

                return res
                    .status(200)
                    .send(result);
            } else {

                return res
                    .status(400)
                    .send();
            }
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public set = async (req:Request, res:Response) => {
        try {
            const body = req.body;
            console.log(req.body);
            if (body && this.password_regex.test(body.password)) {
                const result = await this.db_manager.create(body);

                return res
                    .status(200)
                    .send(result);
            } else {
                return res
                    .status(400)
                    .send();
            }
        } catch (error) {
            return res
                .status(404)
                .send(error.message);
        }
    };

    public update = async (req:Request, res:Response) => {
        try {
            const body = req.body;
            if (body && this.uuid_regex.test(req.params.id) && this.password_regex.test(body.password)) {
                const result = await this.db_manager.update(req.params.id, body);

                return res
                    .status(200)
                    .send(result);
            } else {
                return res
                    .status(400)
                    .send();
            }
        } catch (error) {
            return res
                .status(400)
                .send();
        }
    };

    /**
     * должен содержать хотя бы одну цифру,
     * хотя бы одну строчную лат. букву,
     * хотя бы одну прописную лат. букву,
     * и быть размером не меньше 8 символов
     */
    private password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
}
