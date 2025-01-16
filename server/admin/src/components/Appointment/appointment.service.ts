import { RABBITMQ_QUEUE_NAME } from "../../constant/message";
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import { IReplayFromAppointment } from "./interface/appointment.interface";


class AppointmentService {

    /**
         * Handles receiving a reply from the doctor service through RabbitMQ.
         * @returns - The response from the doctor service.
         */
        async getReplyFromAppointment(): Promise<IReplayFromAppointment> {
            return new Promise(async (resolve, reject) => {
                const consumerTag = await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE, async (message: string) => {
                    try {
                        const messageData = JSON.parse(message);
                        resolve(messageData);
                        logger.info(__filename, "getReplyFromAppointment", "", "Reply from Appointment service: ", messageData);
    
                        await rabbitMQ.unsubscribeFromQueue(consumerTag);
                    } catch (error) {
                        logger.error(__filename, "getReplyFromAppointment", "", "Error while receiving reply from Appointment")
                        reject(error);
                    }
                });
            });
        }

    /**
     * Get all Appointments by sending a request to the appointment service.
     * @returns 
     */

    async getAllAppointment(): Promise<IReplayFromAppointment>{
        try {
            const message = "Request to get all Appointments."

            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_APPOINTMENT_QUEUE, message)
            logger.info(__filename, "getAllAppointment", "", "Requested to get all Appointments.")
            const reply = await this.getReplyFromAppointment()

            const appointments = {
                status: reply.status,
                message: reply.message,
                data: JSON.parse(reply.data)
            }

            return appointments
        } catch (error) {
            logger.error(__filename, "getAllAppointment", "", "Error while getting all appointments: ", error)
            throw error
        }
    }

}

export default new AppointmentService()