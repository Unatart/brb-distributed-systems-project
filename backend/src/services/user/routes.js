"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var innerMiddleware_1 = require("../../middlewares/innerMiddleware");
var outerMiddleware_1 = require("../../middlewares/outerMiddleware");
exports.userRoutes = function (app, controller) {
    app.get("/users/:id", outerMiddleware_1.outerMiddleware, controller.get);
    app.patch("/users/:id", outerMiddleware_1.outerMiddleware, controller.update);
    // ---- private ----
    // -- ONLY AUTH PASS --
    app.post("/users/", controller.set);
    app.get("/users/", controller.getByNameAndPassword);
    // -- ONLY AUTH PASS FINISH
    app.get("/users/check/:id", innerMiddleware_1.innerMiddleware, controller.check);
};
