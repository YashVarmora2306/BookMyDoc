import { logger } from "../../utils/logger";
import { IDoctorData } from "./interface/doctor.interface";
import doctorService from "./doctor.service";
import { GLOBAL_MESSAGE, RABBITMQ_QUEUE_NAME, SUCCESS_MESSAGE } from "../../constant/message";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";


class DoctorController {
    /**
   * Handles user registration.
   * @param doctorPayload - The doctor data to be registered.
   */

    async registerDoctor(doctorPayload: IDoctorData) {
        try {

            // Hash the password
            const hashedPassword = await doctorService.convertPlainTextToHash(doctorPayload.password);
            const doctorData: IDoctorData = {
                ...doctorPayload,
                password: hashedPassword
            }
            const doctor = await doctorService.createDoctor(doctorData);
            logger.info(__filename, "registerDoctor", "", SUCCESS_MESSAGE.DOCTOR_ADDED, doctor)

        } catch (error) {
            logger.error(__filename, "registerDoctor", "", GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }

    /**
     * Subscribes to the queue for doctor registration requests.
     */

    async subscribeToDoctorQueue() { 
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_QUEUE, async (message: string) => {
                const doctorPayload: IDoctorData = JSON.parse(message);
                logger.info(__filename, "subscribeToDoctorQueue", "", "Processing doctor registration request.");
                await this.registerDoctor(doctorPayload);
                logger.info(__filename, "subscribeToDoctorQueue", "", "Doctor registration request processed.");
            });
        } catch (error) { 
            logger.error(__filename, "subscribeToDoctorQueue", "", "Error processing doctor registration request: ", error);
        }
    }
}

export default new DoctorController()