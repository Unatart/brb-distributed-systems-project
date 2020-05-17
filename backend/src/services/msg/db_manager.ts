import {CommonDbManager} from "../../common/common_manager";
import {ErrorCodes} from "../../common/error_codes";
import {Msg} from "./entity";
import {createDate} from "../../helpers";


export class MsgManager extends CommonDbManager<Msg> {
    public async get(user_id:string, group_id:string) {
        const msg:Msg[] = await this.repository.find({ where: { user_id: user_id, group_id: group_id } });
        if (msg) {
            return msg.sort(this.sortHelper).slice(-25);
        }

        throw Error(ErrorCodes.NO_MESSAGES);
    }

    public async set(body:any) {
        const msg = await this.repository.create({...body, time: createDate()});
        return await this.repository.save(msg);
    }

    public async update(id:string, body:any) {
        const msg = await this.repository.findOne({ where: { msg_id: id } });
        if (msg) {
            await this.repository.merge(msg, body);
            return await this.repository.save(msg);
        } else {
            throw Error(ErrorCodes.INCORRECT_UID);
        }
    };

    public async delete(group_id:string) {
        return await this.repository
            .createQueryBuilder()
            .delete()
            .from(Msg)
            .where({ group_id: group_id })
            .execute();
    }

    private sortHelper(a:Msg, b:Msg):number {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
    }
}


