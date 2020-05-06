import {innerMiddleware} from "../../middlewares/innerMiddleware";
import {outerMiddleware} from "../../middlewares/outerMiddleware";

export const userRoutes = (app, controller) => {
    app.get("/users/:id", outerMiddleware, controller.get);

    app.patch("/users/:id", outerMiddleware, controller.update);

    // ---- private ----
    // -- ONLY AUTH PASS --
    app.post("/users/", controller.set);

    app.get("/users/",  controller.getByNameAndPassword);
    // -- ONLY AUTH PASS FINISH

    app.get("/users/check/:id", innerMiddleware, controller.check);
};
