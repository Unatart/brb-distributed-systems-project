import {innerMiddleware} from "../../middlewares/innerMiddleware";
import {outerMiddleware} from "../../middlewares/outerMiddleware";
import {CircuitBreaker} from "../../common/circuitBreaker";

export const messageCircuitBreaker = new CircuitBreaker(20000, 3, "msg");

export const groupRoutes = (app, controller) => {
    app.get("/groups/:id", outerMiddleware, controller.get);

    app.get("/groups/members/:id", outerMiddleware, controller.getMembers);

    app.post("/groups/", outerMiddleware, controller.set);

    app.patch("/groups/:id", outerMiddleware, controller.update);

    app.delete("/groups/:id", outerMiddleware, controller.delete);

    // ---- private ----

    app.get("/groups/check/:id", innerMiddleware, controller.check);
};
