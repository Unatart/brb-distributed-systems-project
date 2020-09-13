import {NextFunction, Request, Response} from "express";
import {ErrorCodes} from "../../common/error_codes";
import {outerMiddleware} from "../../middlewares/outerMiddleware";

export const gatewayRoutes = (app, controller) => {
    const gatewayMiddleware = async (req:Request, res:Response, next:NextFunction) => {
        return controller.checkThirdPartyRegistration(req, res)
            .then((result) => {
                if (result) {
                    console.log("next");
                    return next();
                }
                return res
                    .status(401)
                    .send(ErrorCodes.UNREGISTERED_APPLICATION);
            })
    };

    app.post("/oauth/", gatewayMiddleware, outerMiddleware, controller.createCode);

    app.post("/oauth/token", gatewayMiddleware, controller.getToken);

    app.get("/oauth/", gatewayMiddleware, controller.checkOauthToken);

    app.get("/gateway/user/:id", gatewayMiddleware, controller.getUserData);
};
