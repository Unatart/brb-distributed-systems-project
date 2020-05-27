import {req, res} from "../../common/test/mocks";
import * as typeorm from "typeorm";
import {Connection, EntitySchema, ObjectType, Repository} from "typeorm";
import { User } from "./entity";
import {UserController} from "./controller";
import {UserManager} from "./db_manager";
import {ErrorCodes} from "../../common/error_codes";

export const user:User = {
    user_id: "1",
    password: "pass",
    name: "UserName",
    email:" user@outlook.com",
    admin: false,
    hashPassword: jest.fn()
};

const good_request:req = {
    params: {
        id: "0595741d-d1ac-461e-b593-54302297ce32"
    },
    body: {
        name: "Useeer07",
        password: "Udsvfg136asdGT"
    },
    query: {}
};

const bad1_request:req = {
    params: {
        id: "1"
    },
    body: {
        name: "",
        password: "Udsvfg136asdGT"
    },
    query: {}
};

const bad2_request:req = {
    params: {
        id: "1"
    },
    body: {
        name: "Useeer07",
        password: ""
    },
    query: {}
};

const response:res = {
    send: jest.fn,
    status: () => ({ send: (result) => result }),
    json: jest.fn
};

describe("User controller", () => {
    let db_manager;
    let controller;

    beforeEach(() => {
        jest.spyOn(typeorm, "getConnection").mockImplementation(() => {
            return {
                getRepository<Entity>(target:ObjectType<Entity>|EntitySchema<Entity>|string):Repository<Entity> {
                    return {} as Repository<Entity>;
                }
            } as Connection;
        });

        db_manager = new UserManager(User);
        controller = new UserController(db_manager);

        db_manager.get = jest.fn().mockImplementation(async () => await user);
        db_manager.getByNameAndPassword = jest.fn().mockImplementation(async () => await user);
        db_manager.set = jest.fn().mockImplementation(async () => await user);
        db_manager.update = jest.fn().mockImplementation(async () => await user);
        db_manager.getMany = jest.fn().mockImplementation(async () => await [user]);
        db_manager.convertIds = jest.fn().mockImplementation(async () => await { "1": user });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get", (done) => {
        return Promise.resolve()
            .then(() => controller.get(good_request, response))
            .then((result) => {
                expect(result).toEqual(user);
                done();
            });
    });

    it("get failed", (done) => {
        const request:req = {
            params: undefined,
            body: {},
            query: {}
        };

        return Promise.resolve()
            .then(() => controller.get(request, response))
            .then((result) => {
                expect(result).toEqual("Cannot read property 'id' of undefined");
                done();
            });
    });

    it("get by name and password", (done) => {
        return Promise.resolve()
            .then(() => controller.getByNameAndPassword(good_request, response))
            .then((result) => {
                expect(result).toEqual(user);
                done();
            });
    });

    it("get by name and password failed cause of name", (done) => {
        return Promise.resolve()
            .then(() => controller.getByNameAndPassword(bad1_request, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.USERNAME_REGEX_MATCH);
                done();
            });
    });

    it("get by name and password failed cause of password", (done) => {
        return Promise.resolve()
            .then(() => controller.getByNameAndPassword(bad2_request, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.PASSWORD_REGEX_MATCH);
                done();
            });
    });

    it("set", (done) => {
        return Promise.resolve()
            .then(() => controller.set(good_request, response))
            .then((result) => {
                expect(result).toEqual(user);
                done();
            });
    });

    it("set failed cause username", (done) => {
        return Promise.resolve()
            .then(() => controller.set(bad1_request, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.USERNAME_REGEX_MATCH);
                done();
            });
    });

    it("set failed cause password", (done) => {
        return Promise.resolve()
            .then(() => controller.set(bad2_request, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.PASSWORD_REGEX_MATCH);
                done();
            });
    });

    it("update", (done) => {
        return Promise.resolve()
            .then(() => controller.update(good_request, response))
            .then((result) => {
                expect(result).toEqual(user);
                done();
            });
    });

    it("update failed", (done) => {
        return Promise.resolve()
            .then(() => controller.update({
                params: {
                    id: undefined
                },
                body: {
                    name: "Useeer07",
                    password: "Udsvfg136asdGT"
                },
                query: {}
            }, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.UID_REGEX_MATCH);
                done();
            });
    });

    it("check", (done) => {
        return Promise.resolve()
            .then(() => controller.check(good_request, response))
            .then((result) => {
                expect(result).toEqual({ "exist": true });
                done();
            });
    });

    it("check failed", (done) => {
        return Promise.resolve()
            .then(() => controller.check(bad1_request, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.UID_REGEX_MATCH);
                done();
            });
    });

    it("check many", (done) => {
        return Promise.resolve()
            .then(() => controller.checkMany(good_request, response))
            .then((result) => {
                expect(result).toEqual([user]);
                done();
            });
    });

    it("convertIds", (done) => {
        return Promise.resolve()
            .then(() => controller.convertIds(good_request, response))
            .then((result) => {
                expect(result).toEqual({ "1": user });
                done();
            });
    });
});
