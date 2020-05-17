import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column("uuid")
    group_id:string;

    @Column()
    user_id:string;

    @Column()
    name:string;
}
