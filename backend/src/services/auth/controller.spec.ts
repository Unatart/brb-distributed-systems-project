import * as typeorm from "typeorm";
import {Auth} from "./entity";
import {Connection, EntitySchema, ObjectType, Repository} from "typeorm";
import { AuthManager } from "./db_manager";
import {AuthController} from "./controller";
import {req, res} from "../../common/test/mocks";

const auth:Auth = {
    id: "1",
    token: "token1",
    expires: "data",
    user_id: "2",
    service_key: "3",
    service_secret: "secret3",
    is_admin: false
}

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

describe("Auth controller", () => {
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

        db_manager = new AuthManager(Auth);
        controller = new AuthController(db_manager);

        db_manager.create = jest.fn().mockImplementation(async () => await auth);
        db_manager.update = jest.fn().mockImplementation(async () => await auth);
        db_manager.checkAndUpdate = jest.fn().mockImplementation(async () => await auth);
        db_manager.serviceCreate = jest.fn().mockImplementation(async () => await auth);
        db_manager.serviceCheck = jest.fn().mockImplementation(async () => await auth);
        db_manager.serviceUpdate = jest.fn().mockImplementation(async () => await auth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("signUp", (done) => {
        return Promise.resolve()
            .then(() => controller.signUp(good_request, response))
            .then((result) => {
                expect(result).toEqual(auth);
                done();
            });
    });

    it("signIn", (done) => {
        return Promise.resolve()
            .then(() => controller.signIn(good_request, response))
            .then((result) => {
                expect(result).toEqual(auth);
                done();
            });
    });

    it("checkToken", (done) => {
        return Promise.resolve()
            .then(() => controller.checkToken(good_request, response))
            .then((result) => {
                expect(result).toEqual(auth);
                done();
            });
    });

    it("createTokenForService", (done) => {
        return Promise.resolve()
            .then(() => controller.createTokenForService(good_request, response))
            .then((result) => {
                expect(result).toEqual(auth);
                done();
            });
    });

    it("checkTokenForService", (done) => {
        return Promise.resolve()
            .then(() => controller.checkTokenForService(good_request, response))
            .then((result) => {
                expect(result).toEqual(auth);
                done();
            });
    });

    it("updateTokenForService", (done) => {
        return Promise.resolve()
            .then(() => controller.updateTokenForService(good_request, response))
            .then((result) => {
                expect(result).toEqual(auth);
                done();
            });
    });
});
