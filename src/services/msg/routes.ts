export const msgRoutes = (app, controller) => {
    app.get("/msg/:user_id/group/:group_id", controller.get);

    app.post("/msg/", controller.set);

    app.patch("/msg/:id", controller.update);
};
