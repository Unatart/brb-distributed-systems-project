import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Auth {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ nullable: true })
    user_id:string;

    @Column({ nullable: true })
    service_key:string;

    @Column({ nullable: true })
    service_secret:string;

    @Column({ nullable: true })
    token:string;

    @Column({ nullable: true })
    expires:string;
}
