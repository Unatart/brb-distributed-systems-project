import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    group_id:string;

    @Column({type: "simple-array"})
    users:string[];

    @Column()
    name:string;
}
