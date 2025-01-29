import { logger } from "../../utils/logger";
import patientsController from "./patients.controller";



const receiver = async () => {
    try {
        await patientsController.getDoctor();
        await patientsController.updateDoctor();
    } catch (error) {
        logger.error(__filename, "Main", "", "Failed to initialize queue subscription:", error);
    }
}

export default receiver