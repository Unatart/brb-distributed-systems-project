"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var outerMiddleware_1 = require("../../middlewares/outerMiddleware");
exports.statRoutes = function (app, controller) {
    app.get("/stat", outerMiddleware_1.outerMiddleware, isAdmin, controller.get);
};
var isAdmin = function (req, res, next) {
    if (req.query.is_admin === "true") {
        return next();
    }
    return res
        .status(401)
        .send(Error("only admin allowed" /* ADMIN_ALLOWED */));
};
