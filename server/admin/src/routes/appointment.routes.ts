import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import appointmentController from "../components/Appointment/appointment.controller";


const router: Router = Router();

router.get("/all-Appointments", authMiddleware, appointmentController.getAllAppointment)

export default router