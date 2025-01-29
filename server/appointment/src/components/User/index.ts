import { logger } from "../../utils/logger";
import userController from "./user.controller";



const receiver = async () => {
    try {
        await userController.subscribeToAppointmentQueue();
    } catch (error) {
        logger.error(__filename, "Main", "", "Failed to initialize queue subscription:", error);
    }
}

export default receiver