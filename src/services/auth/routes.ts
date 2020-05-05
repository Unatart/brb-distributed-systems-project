export const authRoutes = (app, controller) => {
    // users

    app.post("auth/user/", controller.signOut);

    app.get("auth/user/", controller.signIn);

    app.patch("auth/user/:id", controller.updateToken);

    // services

    app.post("auth/service/", controller.createTokenForService);

    app.get("auth/service/", controller.checkTokenForService);

    app.patch("auth/service/", controller.updateTokenForService);
};
