import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

export interface IStat {
    id?:string;
    user_id:string;
    time:string;
    service_name:string;
    method:string;
    body:string;
    extra?:string;
}

@Entity()
export class Stat implements IStat {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    // какой пользователь
    @Column("uuid" )
    user_id:string;

    // когда
    @Column()
    time:string;

    @Column()
    service_name:string;

    // метод
    @Column()
    method:string;

    // тело запроса
    @Column()
    body:string;

    @Column()
    extra:string;
}
