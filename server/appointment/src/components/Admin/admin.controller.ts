import { RABBITMQ_QUEUE_NAME, SUCCESS_MESSAGE } from "../../constant/message"
import { logger } from "../../utils/logger"
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ"
import adminService from "./admin.service"


class AdminController {

    /**
     * Handel get all appointments.
     */
    async getAllAppointments() {
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.GET_APPOINTMENT_QUEUE, async (message: string) => {
                logger.info(__filename, "SubscribeToGetAllAppointments", "", "Processing get all appointments request.")
                const appointments = await adminService.getAllAppointments();
                const reply = JSON.stringify({
                    status: "success",
                    message: SUCCESS_MESSAGE.SUCCESSFULLY_RETRIEVED_APPOINTMENTS,
                    data: JSON.stringify(appointments)
                })
                await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, reply);
                logger.info(__filename, "SubscribeToGetAllAppointments", "", "Get all appointments request processed")
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
            logger.error(__filename, "SubscribeToGetAllAppointments", "", "Error processing get all appointments")
        }
    }
}

export default new AdminController()