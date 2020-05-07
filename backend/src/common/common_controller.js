"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonController = /** @class */ (function () {
    function CommonController(init_db_manager) {
        this.uuid_regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        this.db_manager = init_db_manager;
    }
    return CommonController;
}());
exports.CommonController = CommonController;
