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

            const reply = JSON.stringify(
                {
                    status: "success",
                    message: SUCCESS_MESSAGE.DOCTOR_ADDED,
                    data: `Doctor ${doctor.firstName} ${doctor.lastName} successfully registered.`
                });
            
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_REPLY_QUEUE, reply);
            logger.info(__filename, "registerDoctor", "", "Doctor successfully registered. Reply sent to admin service.")

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const reply = JSON.stringify(
                {
                    status: "error",
                    message: GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR,
                    data: errorMessage
                });
            
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_REPLY_QUEUE, reply);

            logger.error(__filename, "registerDoctor", "", GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }

    /**
     * Subscribes to the queue for doctor registration requests.
     */

    async subscribeToDoctorQueue() {
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_CREATION_QUEUE, async (message: string) => {
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