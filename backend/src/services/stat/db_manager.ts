import {CommonDbManager} from "../../common/common_manager";
import {IStat, Stat} from "./entity";

export class StatManager extends CommonDbManager<Stat> {
    public async get(count?:number, service_name?:string, method?:string) {
        let query_builder = this.repository.createQueryBuilder("stat");

        if (service_name && method) {
            query_builder = query_builder
                .where(
                    "stat.service_name = :service_name AND stat.method = :method",
                    { service_name: service_name, method: method }
                );
        } else {
            if (service_name) {
                query_builder = query_builder.where(
                    "stat.service_name = :service_name",
                    { service_name: service_name }
                );
            }

            if (method) {
                query_builder = query_builder.where(
                    "stat.method = :method",
                    { method: method }
                );
            }
        }

        if (count) {
            return query_builder.limit(count).getMany();
        } else {
            if (!service_name && !method) {
                query_builder = query_builder.select();
            }
            return query_builder.limit(50).getMany();
        }
    }

    public async set(msg:IStat) {
        const record = JSON.parse(""+msg);
        const stat = await this.repository.create({
            user_id: record.user_id,
            time: record.time,
            service_name: record.service_name,
            method: record.method,
            body: record.body,
            extra: record.extra
        });
        return await this.repository.save(stat);
    }
}
