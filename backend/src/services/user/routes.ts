import {innerMiddleware} from "../../middlewares/innerMiddleware";
import {outerMiddleware} from "../../middlewares/outerMiddleware";

export const userRoutes = (app, controller) => {
    // ---- private ----
    // -- ONLY AUTH PASS --

    app.post("/users", controller.set);

    app.get("/users/",  controller.getByNameAndPassword);
    // -- ONLY AUTH PASS FINISH

    app.get("/users/check/:id", innerMiddleware, controller.check);

    app.get("/users/check_many", innerMiddleware, controller.checkMany);

    app.get("/convert_users", innerMiddleware, controller.convertIds);

    // public

    app.get("/users/:id", outerMiddleware, controller.get);

    app.get("/users/gateway/:id", innerMiddleware, controller.get);

    app.patch("/users/:id", outerMiddleware, controller.update);
};
