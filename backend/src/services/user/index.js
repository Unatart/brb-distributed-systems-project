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
var db_manager_1 = require("./db_manager");
var entity_1 = require("./entity");
var controller_1 = require("./controller");
var routes_1 = require("./routes");
var database_1 = require("../../common/database");
var host_config_1 = require("../../common/host_config");
var app = express();
app.use(bodyParser.json());
var user_database = __assign(__assign({}, database_1.database), { schema: "user", entities: [entity_1.User] });
typeorm_1.createConnection(user_database).then(function () {
    var db_manager = new db_manager_1.UserManager(entity_1.User);
    var controller = new controller_1.UserController(db_manager);
    routes_1.userRoutes(app, controller);
    app.listen(host_config_1.host.USER.port, function () {
        console.log("API " + host_config_1.host.USER.name + " running in http://localhost:" + host_config_1.host.USER.port);
    });
});
