import { Router } from "express";
import AuthRouter from "./auth.routes";
import AppointmentRouter from "./appointment.routes";
import DashboardRouter from "./dashboard.routes";

export default (app: Router) => {
    const apiRouter: Router = Router();

    
    /**
     * All routes go here
     * ! All routes must be prefixed with /api
     */
    app.use("/api", apiRouter);

    // Auth routes
    apiRouter.use("/auth", AuthRouter); 

    //Appointment routes
    apiRouter.use("/appointments", AppointmentRouter);

    //Dashboard routes
    apiRouter.use("/dashboard", DashboardRouter);
}