import { logger } from "../../utils/logger";
import adminController from "./admin.controller";

/**
 * Receiver function to receive messages from the queue
 */

const receiver = async () => {
    try {
        await adminController.getAllAppointments();
    } catch (error) {
        logger.error(__filename, "Main", "", "Failed to initialize queue subscription:", error);
    }
}

export default receiver