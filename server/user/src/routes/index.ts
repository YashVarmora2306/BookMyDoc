import { Router } from "express";
import AuthRouter from "./auth.routes";
import AppointmentRouter from "./appointment.routes";

export default (app: Router) => {
    const apiRouter: Router = Router();

    
    /**
     * All routes go here
     * ! All routes must be prefixed with /api
     */
    app.use("/api", apiRouter);

    // Auth routes
    apiRouter.use("/auth", AuthRouter);

    //appointment routes
    apiRouter.use("/appointment", AppointmentRouter);
}