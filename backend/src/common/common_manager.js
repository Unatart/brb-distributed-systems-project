"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var CommonDbManager = /** @class */ (function () {
    function CommonDbManager(init_repo) {
        this.repository = typeorm_1.getConnection(process.env.NODE_ENV).getRepository(init_repo);
    }
    return CommonDbManager;
}());
exports.CommonDbManager = CommonDbManager;
