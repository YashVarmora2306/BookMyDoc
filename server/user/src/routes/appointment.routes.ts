import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import appointmentController from "../components/Appointment/appointment.controller";

const router: Router = Router();

router.post("/book-appointment", authMiddleware, appointmentController.bookAppointment);
router.get("/appointments", authMiddleware, appointmentController.listAppointments);

export default router;