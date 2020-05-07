"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var typeorm_1 = require("typeorm");
var database_1 = require("../../common/database");
var host_config_1 = require("../../common/host_config");
var db_manager_1 = require("./db_manager");
var entity_1 = require("./entity");
var controller_1 = require("./controller");
var routes_1 = require("./routes");
var app = express();
app.use(bodyParser.json());
var user_database = __assign(__assign({}, database_1.database), { schema: "msg", entities: [entity_1.Msg] });
typeorm_1.createConnection(user_database).then(function () {
    var db_manager = new db_manager_1.MsgManager(entity_1.Msg);
    var controller = new controller_1.MsgController(db_manager);
    routes_1.msgRoutes(app, controller);
    app.listen(host_config_1.host.MSG.port, function () {
        console.log("API " + host_config_1.host.MSG.name + " running in http://localhost:" + host_config_1.host.MSG.port);
    });
});
