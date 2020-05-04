import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    msg_id: string;

    @Column("uuid" )
    user_id: string;

    @Column({ length: 500 })
    text:string;

    @Column({ nullable: true })
    time:string;
}
