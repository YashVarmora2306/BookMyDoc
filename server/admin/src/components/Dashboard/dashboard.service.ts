import { RABBITMQ_QUEUE_NAME } from "../../constant/message";
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import { IDashData, iGetDashboardServiceResponse, IReplay } from "./interface/dashboard.interface";


class DashboardService {

    /**
     * Handles receiving a reply from the doctor service through RabbitMQ.
     * @returns - The response from the doctor service.
     */
    async getReply(queueName: string): Promise<IReplay> {
        return new Promise(async (resolve, reject) => {
            const consumerTag = await rabbitMQ.subscribeToQueue(queueName, async (message: string) => {
                try {
                    const messageData = JSON.parse(message);
                    resolve(messageData);
                    logger.info(__filename, "getReply", "", "Reply : ", messageData);

                    await rabbitMQ.unsubscribeFromQueue(consumerTag);
                } catch (error) {
                    logger.error(__filename, "getReply", "", "Error while receiving reply")
                    reject(error);
                }
            });
        });
    }

    /**
     * Get all patients, doctor appointment data for admin dashboard
     * @returns
     */

    async getAdminDashboard(): Promise<iGetDashboardServiceResponse> {
        try {
            let message = "Request to get all Doctors."
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_DOCTORS_QUEUE, message)
            logger.info(__filename, "getAdminDashboard", "", "Requested to get all Doctors.")
            const doctorReply: IReplay = await this.getReply(RABBITMQ_QUEUE_NAME.DOCTOR_REPLY_QUEUE)
            message = "Request to get all Patients."
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_USERS_QUEUE, message)
            logger.info(__filename, "getAdminDashboard", "", "Requested to get all Patients.")
            const patientReply: IReplay = await this.getReply(RABBITMQ_QUEUE_NAME.USER_REPLY_QUEUE)
            message = "Request to get all Appointments."
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_APPOINTMENT_QUEUE, message)
            logger.info(__filename, "getAllAppointment", "", "Requested to get all Appointments.")
            const appointmentReply: IReplay = await this.getReply(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE)

            const doctors = {
                status: doctorReply.status,
                message: doctorReply.message,
                data: JSON.parse(doctorReply.data)
            }
            const patients = {
                status: patientReply.status,
                message: patientReply.message,
                data: JSON.parse(patientReply.data)
            }
            const appointments = {
                status: appointmentReply.status,
                message: appointmentReply.message,
                data: JSON.parse(appointmentReply.data)
            }

            return {doctors, patients, appointments}


        } catch (error) {
            logger.error(__filename, "getAdminDashboard", "", "Error while getting admin dashboard data")
            throw error;
        }
    }

}

export default new DashboardService()