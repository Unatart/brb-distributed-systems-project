export const groupRoutes = (app, controller) => {
    app.get("/groups/:id", controller.get);

    app.post("/groups/", controller.set);

    app.patch("/groups/:id", controller.update);

    app.delete("/groups/:id", controller.delete);
};
