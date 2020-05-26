import {CommonDbManager} from "../../common/common_manager";
import {ErrorCodes} from "../../common/error_codes";
import {Group} from "./entity";
import * as _ from "underscore";

export class GroupManager extends CommonDbManager<Group> {
    public async get(id:string) {
        const group = await this.repository.findOne({ where: { group_id: id } });
        if (group) {
            return group;
        }

        throw Error(ErrorCodes.NO_SUCH_GROUP);
    }

    public async getByUserId(id:string) {
        const groups = await this.repository.find( {where: { user_id: id }} );
        if (groups) {
            return groups;
        }

        throw Error(ErrorCodes.NO_SUCH_GROUP);
    }

    public async getMembers(id:string) {
        const groups = await this.repository.find({ where: { group_id: id } });
        if (!groups) {
            throw Error(ErrorCodes.NO_SUCH_GROUP);
        }

        return _.map(groups, (group) => {
            return group.user_id;
        });
    }

    public async set(name:string, ids:string[]) {
        let groups = [];

        const group = await this.repository.findOne({ where: { name: name, user_id: ids[0] } });
        if (group) {
            throw Error(ErrorCodes.GROUP_NAME_EXISTS);
        }

        const uid = this.create_UUID();

        for (let i = 0; i < ids.length; i++) {
            const group = await this.repository.create({ group_id: uid, user_id: ids[i], name: name});
            const saved_group = await this.repository.save(group);
            groups.push(saved_group);
        }
        return groups;
    }

    public async update(id:string, body:any) {
        const groups = await this.repository.find({ where: { group_id: id } });
        let results = [];
        if (groups) {
            for (let i = 0; i < groups.length; i++) {
                const group = await this.repository.merge(groups[i], body);
                const one_res = await this.repository.save(group);
                results.push(one_res);
            }

            return results;
        } else {
            throw Error(ErrorCodes.INCORRECT_UID);
        }
    };

    public async delete(id:string) {
        return await this.repository
            .createQueryBuilder()
            .delete()
            .from(Group)
            .where({ group_id: id })
            .execute();
    }

    private create_UUID(){
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) =>  {
            const r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
    }
}
