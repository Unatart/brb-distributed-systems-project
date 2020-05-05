import {innerMiddleware} from "../../middlewares/innerMiddleware";

export const groupRoutes = (app, controller) => {
    app.get("/groups/:id", controller.get);

    app.post("/groups/", controller.set);

    app.patch("/groups/:id", controller.update);

    app.delete("/groups/:id", controller.delete);

    // ---- private ----

    app.check("/groups/:id", innerMiddleware, controller.check);
};
