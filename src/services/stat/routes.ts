import {NextFunction, Request, Response} from "express";
import {ErrorCodes} from "../../common/error_codes";
import {outerMiddleware} from "../../middlewares/outerMiddleware";

export const statRoutes = (app, controller) => {
    app.get("/stat", outerMiddleware, isAdmin, controller.get);
};

const isAdmin = (req:Request, res:Response, next:NextFunction) => {
    if (req.query.is_admin === "true") {
        return next();
    }

    return res
        .status(401)
        .send(Error(ErrorCodes.ADMIN_ALLOWED));
}
