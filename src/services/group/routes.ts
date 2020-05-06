import {innerMiddleware} from "../../middlewares/innerMiddleware";

export const groupRoutes = (app, controller) => {
    app.get("/groups/:id", controller.get);

    app.post("/groups/", controller.set);

    app.patch("/groups/:id", controller.update);

    app.delete("/groups/:id", controller.delete);

    // ---- private ----

    app.get("/groups/check/:id", innerMiddleware, controller.check);
};
