import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    group_id: string;

    @Column()
    user_id: string;

    @Column()
    name:string;
}
