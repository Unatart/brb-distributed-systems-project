import * as typeorm from "typeorm";
import {StatController} from "./controller";
import {StatManager} from "./db_manager";
import {Stat} from "./entity";
import {Connection, EntitySchema, ObjectType, Repository} from "typeorm";
import {req, res} from "../../common/test/mocks";

const msg:Stat = {
    id: "1",
    user_id: "1",
    time: "",
    service_name: "Msg",
    method: "POST",
    body: "{}",
    extra: undefined
};

describe("Stat controller", () => {
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

        db_manager = new StatManager(Stat);
        controller = new StatController(db_manager);

        db_manager.set = jest.fn().mockImplementation(async (msg) => await msg);
        db_manager.get = jest.fn().mockImplementation(async () => await msg);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("set", (done) => {
        return Promise.resolve()
            .then(() => controller.set(msg))
            .then((result) => {
                expect(result).toEqual(msg);
                done();
            });
    });

    it("get", async (done) => {
        const request:req = {
            params: {},
            body: {},
            query: {}
        };

        const response:res = {
            send: jest.fn,
            status: () => ({ send: (result) => result }),
            json: jest.fn
        };

        return Promise.resolve()
            .then(() => controller.get(request, response))
            .then((result) => {
                expect(result).toEqual(msg);
                done();
            });
    })
});
