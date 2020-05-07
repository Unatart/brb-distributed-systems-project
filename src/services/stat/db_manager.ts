import {CommonDbManager} from "../../common/common_manager";
import {IStat, Stat} from "./entity";

export class StatManager extends CommonDbManager<Stat> {
    public async get(count?:number, service_name?:string) {
        if (count && service_name) {
            return this.repository.createQueryBuilder("stat")
                .having("stat.service_name =: service_name", {service_name: service_name})
                .limit(count);
        }

        if (count) {
            return this.repository.createQueryBuilder("stat").limit(count);
        }

        if (service_name) {
            return this.repository.createQueryBuilder("stat")
                .having("stat.service_name =: service_name", {service_name: service_name});
        }

        return this.repository.createQueryBuilder("stat").select().limit(50);
    }

    public async set(msg:IStat) {
        const stat = await this.repository.create(msg);
        return await this.repository.save(stat);
    }
}
