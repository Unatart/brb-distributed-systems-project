import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class ThirdApp {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    app_id:string;

    @Column()
    app_secret:string;

    @Column({ nullable:true })
    token:string;

    @Column({ nullable:true })
    code:string;

    @Column({ nullable:true })
    refresh_token:string;

    @Column({ nullable:true })
    expires:string;

    @Column({nullable: true})
    user_id:string;
}
