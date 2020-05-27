import {CommonDbManager} from "../../common/common_manager";
import {ErrorCodes} from "../../common/error_codes";
import {Msg} from "./entity";


export class MsgManager extends CommonDbManager<Msg> {
    public async get(group_id:string, to:number, from?:number) {
        const msg:Msg[] = await this.repository.find({ where: { group_id: group_id } });
        if (msg) {
            if (from && from !== 0) {
                return msg.sort(this.sortHelper).slice(-to, -from);
            }

            return msg.sort(this.sortHelper).slice(-to);
        }

        throw Error(ErrorCodes.NO_MESSAGES);
    }

    public async set(body:any) {
        const msg = await this.repository.create(body);
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

    public delete = async (group_id:string) => {
        return await this.repository
            .createQueryBuilder()
            .delete()
            .from(Msg)
            .where({ group_id: group_id.replace(/['"]+/g, '') })
            .execute();
    }

    private sortHelper(a:Msg, b:Msg):number {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
    }
}


