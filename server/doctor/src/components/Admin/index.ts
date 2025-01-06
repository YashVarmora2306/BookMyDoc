import { logger } from "../../utils/logger";
import adminController from "./admin.controller";



const receiver = async () => {
    try {
        await adminController.subscribeToDoctorQueue();
        await adminController.GetAllDoctors();
        await adminController.changeAvailability();
    } catch (error) {
        logger.error(__filename, "Main", "", "Failed to initialize queue subscription:", error);
    }
}

export default receiver