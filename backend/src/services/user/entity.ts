import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate} from "typeorm";
import {createHmac} from "crypto";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    user_id:string;

    @Column()
    password:string;

    @Column( { unique: true })
    name:string;

    @Column({ nullable: true })
    email:string;

    @Column({ nullable: true })
    admin?:boolean;

    @BeforeInsert()
    hashPassword() {
        if (this.password) {
            this.password = createHmac('sha256', this.password).digest('hex');
        }
    }
}
