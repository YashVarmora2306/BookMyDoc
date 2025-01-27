import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import dashboardController from "../components/Dashboard/dashboard.controller";


const router: Router = Router();

router.get("/dashData", authMiddleware, dashboardController.getDashboardData);

export default router