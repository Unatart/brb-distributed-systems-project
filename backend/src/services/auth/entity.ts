import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Auth {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ nullable:true })
    token:string;

    @Column({ nullable:true })
    expires:string;

    // USER
    @Column({ nullable:true })
    user_id:string;

    // SERVICES
    @Column({ nullable:true })
    service_key:string;

    @Column({ nullable:true })
    service_secret:string;

    // 3rd party APP
    @Column({ nullable:true })
    app_id:string;

    @Column({ nullable:true })
    app_secret:string;

    @Column({ nullable:true })
    code:string;

    @Column({ nullable:true })
    refresh_token:string;
}
