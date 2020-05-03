import {User} from "./entity";
import {createHmac} from "crypto";
import {CommonDbManager} from "../../common/common_manager";

export class UserManager extends CommonDbManager<User> {
    public async get(id:string) {
        const user = await this.repository.findOne(id);
        if (user) {
            return user;
        }

        throw Error();
    }

    public async create(body:any) {
        const user = await this.repository.create(body);
        return await this.repository.save(user);
    }

    public async update(id:string, body:any) {
        const user = await this.repository.findOne(id);
        if (user) {
            if (user.password !== createHmac('sha256', body.password).digest('hex')) {
                throw Error()
            }
            if (user.name !== body.name) {
                const is_user_name_exist = await this.repository.findOne({where: {name: body.name}});
                if (is_user_name_exist) {
                    throw Error();
                }
            }
            await this.repository.merge(user, body);
            return await this.repository.save(user);
        } else {
            throw Error();
        }
    };
}
