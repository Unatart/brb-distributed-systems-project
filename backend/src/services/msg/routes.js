"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var outerMiddleware_1 = require("../../middlewares/outerMiddleware");
exports.msgRoutes = function (app, controller) {
    app.get("/msg/:user_id/group/:group_id", outerMiddleware_1.outerMiddleware, controller.get);
    app.post("/msg/", outerMiddleware_1.outerMiddleware, controller.set);
    app.patch("/msg/:id", outerMiddleware_1.outerMiddleware, controller.update);
};
