import {outerMiddleware} from "../../middlewares/outerMiddleware";

export const msgRoutes = (app, controller) => {
    app.get("/msg/:user_id/group/:group_id", outerMiddleware, controller.get);

    app.post("/msg/", outerMiddleware, controller.set);

    app.patch("/msg/:id", outerMiddleware, controller.update);
};
