import { logger } from "../../utils/logger";
import adminController from "./doctor.controller";



const receiver = async () => {
    try {
        await adminController.getDoctorAppointments();
    } catch (error) {
        logger.error(__filename, "Main", "", "Failed to initialize queue subscription:", error);
    }
}

export default receiver