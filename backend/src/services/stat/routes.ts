import {outerMiddleware} from "../../middlewares/outerMiddleware";

export const statRoutes = (app, controller) => {
    app.get("/stat", outerMiddleware, controller.get);
};
