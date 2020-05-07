"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var innerMiddleware_1 = require("../../middlewares/innerMiddleware");
var outerMiddleware_1 = require("../../middlewares/outerMiddleware");
exports.groupRoutes = function (app, controller) {
    app.get("/groups/:id", outerMiddleware_1.outerMiddleware, controller.get);
    app.post("/groups/", outerMiddleware_1.outerMiddleware, controller.set);
    app.patch("/groups/:id", outerMiddleware_1.outerMiddleware, controller.update);
    app.delete("/groups/:id", outerMiddleware_1.outerMiddleware, controller.delete);
    // ---- private ----
    app.get("/groups/check/:id", innerMiddleware_1.innerMiddleware, controller.check);
};
