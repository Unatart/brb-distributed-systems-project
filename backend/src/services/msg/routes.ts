import {outerMiddleware} from "../../middlewares/outerMiddleware";
import {innerMiddleware} from "../../middlewares/innerMiddleware";

export const msgRoutes = (app, controller) => {
    app.get("/msg/:group_id", outerMiddleware, controller.get);

    app.post("/msg/", outerMiddleware, controller.set);

    app.patch("/msg/:id", outerMiddleware, controller.update);

    // private
    app.delete("/msg/:group_id", innerMiddleware, controller.deleteByGroup);
};
