import {CommonDbManager} from "../../common/common_manager";
import {ErrorCodes} from "../../common/error_codes";
import {Group} from "./entity";

export class GroupManager extends CommonDbManager<Group> {
    public async get(id:string) {
        const group = await this.repository.findOne({ where: { group_id: id } });
        if (group) {
            return group;
        }

        throw Error(ErrorCodes.NO_SUCH_GROUP);
    }

    public async set(body:any) {
        const group = await this.repository.create(body);
        return await this.repository.save(group);
    }

    public async update(id:string, body:any) {
        const group = await this.repository.findOne({ where: { group_id: id } });
        if (group) {
            await this.repository.merge(group, body);
            return await this.repository.save(group);
        } else {
            throw Error(ErrorCodes.INCORRECT_UID);
        }
    };

    public async delete(id:string) {
        return await this.repository.delete(id);
    }
}
