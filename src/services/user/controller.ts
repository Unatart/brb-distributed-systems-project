import {Request, Response} from "express";
import {UserManager} from "./db_manager";
import {CommonController} from "../../common/common_controller";
import {ErrorCodes} from "../../common/error_codes";


export class UserController extends CommonController<UserManager> {
    public get = async (req:Request, res:Response) => {
        try {
            const uuid = req.params.id;
            if (this.uuid_regex.test(uuid)) {
                const result = await this.db_manager.get(uuid);

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
            if (this.username_regex.test(body.name)) {
                return res
                    .status(400)
                    .send(ErrorCodes.USERNAME_REGEX_MATCH);
            }
            if (!this.password_regex.test(body.password)) {
                return res
                    .status(400)
                    .send(ErrorCodes.PASSWORD_REGEX_MATCH);
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
            if (!this.uuid_regex.test(req.params.id)) {
                return res
                    .status(400)
                    .send(ErrorCodes.UID_REGEX_MATCH);
            }

            if (!this.password_regex.test(req.body.password)) {
                return res
                    .status(400)
                    .send(ErrorCodes.PASSWORD_REGEX_MATCH)
            }

            const result = await this.db_manager.update(req.params.id, req.body);

            return res
                .status(200)
                .send(result);
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

    /**
     * должен включать в себя строчные и прописные латинские буквы, цифры, символы - и _,
     * и быть длинной от 6 до 32 символов
     */
    private username_regex = /^[a-zA-Z0-9_-]{6,32}$/;
}
