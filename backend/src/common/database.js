"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV === 'develop') {
    exports.database = {
        name: "develop",
        type: "postgres",
        host: "localhost",
        username: "unatart",
        password: "unatart",
        database: "brb_microservices",
        entities: ["src/services/*/entity/*.js"],
        logging: ["error"],
        synchronize: true
    };
}
