import {User} from "./entity";
import {CommonDbManager} from "../../common/common_manager";
import {ErrorCodes} from "../../common/error_codes";
import {createHmac} from "crypto";
import {In} from "typeorm";

export class UserManager extends CommonDbManager<User> {
    public async get(id:string) {
        const user = await this.repository.findOne({ where: { user_id: id } });
        if (user) {
            return user;
        }

        throw Error(ErrorCodes.INCORRECT_UID);
    }

    public async getMany(names:string[]) {
        return await this.repository.find({ where: { name: In(names) } });
    }

    public async convertIds(ids:string[]):Promise<any> {
        const users = await this.repository.find({ where: {user_id: In(ids) } });
        if (users) {
            const map = {};

            for (let i = 0; i < users.length; i++) {
                if (!map[users[i].user_id]) {
                    map[users[i].user_id] = users[i].name;
                }
            }

            return map;
        }

        throw Error(ErrorCodes.NO_SUCH_USER);
    }

    public async set(body:any) {
        const existed = await this.repository.findOne({ where: { name: body.name } });
        if (existed) {
            throw Error(ErrorCodes.USER_ALREADY_EXIST);
        }
        const user = await this.repository.create(body);
        return await this.repository.save(user);
    }

    public async getByNameAndPassword(body:any) {
        const pass = createHmac('sha256', body.password).digest('hex');
        return await this.repository.findOne({ where: { name: body.name, password: pass } });
    }

    public async update(id:string, body:any) {
        const user = await this.repository.findOne({ where: { user_id: id } });
        if (user) {
            if (user.name !== body.name) {
                const is_user_name_exist = await this.repository.findOne({ where: { name: body.name } });
                if (is_user_name_exist) {
                    throw Error(ErrorCodes.USER_NAME_ENGAGED);
                }
            }
            await this.repository.merge(user, body);
            return await this.repository.save(user);
        } else {
            throw Error(ErrorCodes.INCORRECT_UID);
        }
    };
}
