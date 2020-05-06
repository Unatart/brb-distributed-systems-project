import {CommonDbManager} from "../../common/common_manager";
import {ErrorCodes} from "../../common/error_codes";
import {Msg} from "./entity";


export class MsgManager extends CommonDbManager<Msg> {
    public async get(user_id:string, group_id:string) {
        const msg:Msg[] = await this.repository.find({ where: { user_id: user_id, group_id: group_id } });
        if (msg) {
            return msg.sort(this.sortHelper).slice(-25);
        }

        throw Error(ErrorCodes.NO_MESSAGES);
    }

    public async set(body:any) {
        const msg = await this.repository.create({...body, time: this.createDate()});
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

    private sortHelper(a:Msg, b:Msg):number {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
    }

    private createDate():string {
        let d = new Date();
        return d.toISOString().split("").slice(0, 10).join("") + " " + d.toISOString().split("").slice(11, 19).join("");
    }
}


