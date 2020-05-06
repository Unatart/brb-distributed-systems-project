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
    photo_url:string;

    @Column({ nullable: true, length: 500 })
    about_story:string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        if (this.password) {
            this.password = createHmac('sha256', this.password).digest('hex');
        }
    }
}
