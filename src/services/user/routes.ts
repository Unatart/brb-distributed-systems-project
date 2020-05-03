export const userRoutes = (app, user_controller) => {
    app.get("/users/:id", user_controller.get);

    app.post("/users/", user_controller.set);

    app.patch("/users/:id", user_controller.update);
};
