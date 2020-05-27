import {Group} from "./entity";
import * as typeorm from "typeorm";
import {Connection, EntitySchema, ObjectType, Repository} from "typeorm";
import {GroupController} from "./controller";
import {GroupManager} from "./db_manager";
import * as helpers from "../../helpers";
import {req, res} from "../../common/test/mocks";
import {ErrorCodes} from "../../common/error_codes";

const group:Group = {
    id:"1",
    group_id:"2",
    user_id:"3",
    name:"b4e_group"
};

const good_request:req = {
    params: {
        id: "0595741d-d1ac-461e-b593-54302297ce32"
    },
    body: {},
    query: {}
};

const response:res = {
    send: jest.fn,
    status: () => ({ send: (result) => result }),
    json: jest.fn
};

describe("Group controller", () => {
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

        db_manager = new GroupManager(Group);
        controller = new GroupController(db_manager);

        db_manager.set = jest.fn().mockImplementation(async () => await group);
        db_manager.get = jest.fn().mockImplementation(async () => await group);
        db_manager.update = jest.fn().mockImplementation(async () => await group);
        db_manager.delete = jest.fn().mockImplementation(async () => await []);
        db_manager.getMembers = jest.fn().mockImplementation(async () => await [group.user_id]);
        db_manager.getByUserId = jest.fn().mockImplementation(async () => await [group]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("set", (done) => {
        jest.spyOn(helpers, "getThroughMiddleware").mockImplementation(async () => ({}));
        return Promise.resolve()
            .then(() => controller.set(good_request, response))
            .then((result) => {
                expect(result).toEqual(group);
                done();
            });
    });

    it("set without middleware mock", (done) => {
        return Promise.resolve()
            .then(() => controller.set(good_request, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.SERVICE_UNAVAILABLE);
                done();
            });
    });

    it("get", (done) => {
        return Promise.resolve()
            .then(() => controller.get(good_request, response))
            .then((result) => {
                expect(result).toEqual([group]);
                done();
            });
    });

    it("get failed", (done) => {
        return Promise.resolve()
            .then(() => controller.get({
                body: {},
                params: {},
                query: {}
            }, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.UID_REGEX_MATCH);
                done();
            });
    });

    it("update", (done) => {
        return Promise.resolve()
            .then(() => controller.update(good_request, response))
            .then((result) => {
                expect(result).toEqual(group);
                done();
            });
    });

    it("update failed", (done) => {
        return Promise.resolve()
            .then(() => controller.update({
                body: {},
                params: {},
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
                expect(result).toEqual({ exist: true });
                done();
            });
    });

    it("check failed", (done) => {
        return Promise.resolve()
            .then(() => controller.check({
                body: {},
                params: {},
                query: {}
            }, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.UID_REGEX_MATCH);
                done();
            });
    });

    it("getMembers", (done) => {
        return Promise.resolve()
            .then(() => controller.getMembers(good_request, response))
            .then((result) => {
                expect(result).toEqual([group.user_id]);
                done();
            });
    });

    it("getMembers failed", (done) => {
        return Promise.resolve()
            .then(() => controller.getMembers({
                body: {},
                params: {},
                query: {}
            }, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.UID_REGEX_MATCH);
                done();
            });
    });

    it("delete", (done) => {
        return Promise.resolve()
            .then(() => controller.delete(good_request, response))
            .then((result) => {
                expect(result).toEqual(undefined);
                done();
            });
    });

    it("delete failed", (done) => {
        return Promise.resolve()
            .then(() => controller.delete({
                body: {},
                params: {},
                query: {}
            }, response))
            .then((result) => {
                expect(result).toEqual(ErrorCodes.UID_REGEX_MATCH);
                done();
            });
    });
});
