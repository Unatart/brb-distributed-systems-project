export const userRoutes = (app, controller) => {
    app.get("/users/:id", controller.get);

    app.post("/users/", controller.set);

    app.patch("/users/:id", controller.update);
};
