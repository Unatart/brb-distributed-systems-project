export const authRoutes = (app, controller) => {
    app.post("/auth/user/", controller.signUp);

    app.post("/auth/user/login/", controller.signIn);

    app.get("/auth/user/:id", controller.checkToken);

    app.post("/auth/service/", controller.createTokenForService);

    app.get("/auth/service/", controller.checkTokenForService);

    app.patch("/auth/service/", controller.updateTokenForService);
};
