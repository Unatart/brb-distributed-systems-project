import {ConnectionOptions} from "typeorm";

export let database:ConnectionOptions;

if (process.env.NODE_ENV === 'develop') {
    database = {
        name: "develop",
        type: "postgres",
        host: "localhost",
        username: "unatart",
        password: "unatart",
        database: "brb_microservices",
        entities: ["src/services/*/entity/*.js"],
        logging: ["error"],
        synchronize: true
    }
}
