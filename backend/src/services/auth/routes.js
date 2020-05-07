"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = function (app, controller) {
    // users
    app.post("/auth/user/", controller.signOut);
    app.post("/auth/user/login/", controller.signIn);
    app.get("/auth/user/:id", controller.checkToken);
    // services
    app.post("/auth/service/", controller.createTokenForService);
    app.get("/auth/service/", controller.checkTokenForService);
    app.patch("/auth/service/", controller.updateTokenForService);
    // oauth
    app.post("/oauth/", controller.createCode);
    app.post("/oauth/token", controller.getToken);
};
