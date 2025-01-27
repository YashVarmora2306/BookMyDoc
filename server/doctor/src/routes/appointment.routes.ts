import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import appointmentController from "../components/Appointment/appointment.controller";

const router: Router = Router();

router.get("/doctor-appointments", authMiddleware, appointmentController.getDoctorAppointments)

export default router;