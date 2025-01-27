import { RABBITMQ_QUEUE_NAME, SUCCESS_MESSAGE } from "../../constant/message"
import { logger } from "../../utils/logger"
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ"
import adminService from "./doctor.service"


class AdminController {

    /**
     * Handel get doctor appointments.
     */
    async getDoctorAppointments() {
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.GET_DOCTOR_APPOINTMENT_QUEUE, async (message: string) => {
                logger.info(__filename, "SubscribeToGetDoctorAppointments", "", "Processing get Doctor appointments request.")
                const appointments = await adminService.getDoctorAppointments(message);
                const reply = JSON.stringify({
                    status: "success",
                    message: SUCCESS_MESSAGE.SUCCESSFULLY_RETRIEVED_APPOINTMENTS,
                    data: JSON.stringify(appointments)
                })
                await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply);
                logger.info(__filename, "SubscribeToGetDoctorAppointments", "", "Get doctor appointments request processed")
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const reply = JSON.stringify(
                {
                    status: "error",
                    message: errorMessage,
                    data: null
                }
            );
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply);
            logger.error(__filename, "SubscribeToGetDoctorAppointments", "", "Error processing get doctor appointments")
        }
    }
}

export default new AdminController()