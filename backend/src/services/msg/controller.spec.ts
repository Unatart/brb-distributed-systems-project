import * as typeorm from "typeorm";
import {Connection, EntitySchema, ObjectType, Repository} from "typeorm";
import {MsgManager} from "./db_manager";
import {MsgController} from "./controller";
import {Msg} from "./entity";
import {req, res} from "../../common/test/mocks";
import {ErrorCodes} from "../../common/error_codes";
import * as helpers from "../../helpers";
import {user} from "../user/controller.spec";

const msg:Msg = {
    msg_id: "1",
    user_id: "1",
    group_id: "1-111-1",
    text: "msg text",
    time: "25-05-12 22:34"
};

const good_request:req = {
    params: {
        group_id: "0595741d-d1ac-461e-b593-54302297ce32"
    },
    body: {
        user_id: "0595741d-d1ac-461e-b593-54302297ce32",
        group_id: "0595741d-d1ac-461e-b593-54302297ce32"
    },
    query: {}
};

const response:res = {
    send: jest.fn,
    status: () => ({ send: (result) => result }),
    json: jest.fn
};

describe("Msg controller", () => {
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

        db_manager = new MsgManager(Msg);
        controller = new MsgController(db_manager);

        db_manager.set = jest.fn().mockImplementation(async () => await msg);
        db_manager.get = jest.fn().mockImplementation(async () => await [msg]);
        db_manager.update = jest.fn().mockImplementation(async () => await msg);
        db_manager.delete = jest.fn().mockImplementation(async () => await []);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // it("set without middleware mock", (done) => {
    //     return Promise.resolve()
    //         .then(() => controller.set(good_request, response))
    //         .then((result) => {
    //             expect(result).toEqual(ErrorCodes.SERVICE_UNAVAILABLE);
    //             done();
    //         });
    // });

    it("set", (done) => {
        jest.spyOn(helpers, "getThroughMiddleware").mockImplementation(async () => ({ exist: true }));
        return Promise.resolve()
            .then(() => controller.set(good_request, response))
            .then((result) => {
                expect(result).toEqual(msg);
                done();
            });
    });

    it("set failed", (done) => {
        return Promise.resolve()
            .then(() => controller.set({
                params: {},
                body: {},
                query: {}
            }, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.UID_REGEX_MATCH);
                done();
            });
    });

    // it("get without middleware mock", (done) => {
    //     return Promise.resolve()
    //         .then(() => controller.get(good_request, response))
    //         .then((result) => {
    //             expect(result).toEqual(ErrorCodes.SERVICE_UNAVAILABLE);
    //             done();
    //         });
    // });

    it("get", (done) => {
        jest.spyOn(helpers, "getThroughMiddleware").mockImplementation(async () => ({"1": user.name}));
        return Promise.resolve()
            .then(() => controller.get(good_request, response))
            .then((result) => {
                expect(result).toEqual([{
                    ...msg,
                    user_name: "UserName"
                }]);
                done();
            });
    });

    it("get failed", (done) => {
        return Promise.resolve()
            .then(() => controller.get({
                params: {},
                body: {},
                query: {}
            }, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.UID_REGEX_MATCH);
                done();
            });
    });

    it("update", (done) => {
        jest.spyOn(helpers, "getThroughMiddleware").mockImplementation(async () => ({ exist: true }));
        return Promise.resolve()
            .then(() => controller.update(good_request, response))
            .then((result) => {
                expect(result).toEqual(msg);
                done();
            });
    });

    // it("update without middleware mock", (done) => {
    //     return Promise.resolve()
    //         .then(() => controller.update(good_request, response))
    //         .then((result) => {
    //             expect(result).toEqual(ErrorCodes.SERVICE_UNAVAILABLE);
    //             done();
    //         });
    // });

    it("update failed cause no group", (done) => {
        jest.spyOn(helpers, "getThroughMiddleware").mockImplementation(async () => ({ exist: false }));
        return Promise.resolve()
            .then(() => controller.update(good_request, response))
            .then((result) => {
                expect(result).toEqual("Group didn't exist");
                done();
            });
    });

    it("delete", (done) => {
        return Promise.resolve()
            .then(() => controller.deleteByGroup(good_request, response))
            .then((result) => {
                expect(result).toEqual([]);
                done();
            });
    });
});
