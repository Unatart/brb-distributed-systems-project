import {innerMiddleware} from "../../middlewares/innerMiddleware";

export const userRoutes = (app, controller) => {
    app.get("/users/:id", controller.get);

    app.get("/users/", controller.getByNameAndPassword);

    app.post("/users/", controller.set);

    app.patch("/users/:id", controller.update);

    // ---- private ----

    app.get("/users/check/:id", innerMiddleware, controller.check);
};
