import { RABBITMQ_QUEUE_NAME } from "../../constant/message";
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import { IDashData, iGetDashboardServiceResponse, IPatients, IReplay } from "./interface/dashboard.interface";


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
     * Get all patients, earnings, appointment data for doctor dashboard
     * @returns
     */

    async getDoctorDashboard(doctorId: string): Promise<iGetDashboardServiceResponse> {
        try {
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.GET_DOCTOR_APPOINTMENT_QUEUE, doctorId)
            logger.info(__filename, "getDoctorAppointment", "", "Requested to get doctor Appointments.")
            const appointmentReply: IReplay = await this.getReply(RABBITMQ_QUEUE_NAME.APPOINTMENT_REPLY_QUEUE)

            const appointments = {
                status: appointmentReply.status,
                message: appointmentReply.message,
                data: JSON.parse(appointmentReply.data)
            }

            let patients: IPatients[] = []
            appointments.data.map((item: typeof appointments.data) => { 
                if(!patients.includes(item.patient)){
                    patients.push(item.patient)
                }
            })
            
            let earnings = 0
            appointments.data.map((item: typeof appointments.data) => {
                if (item.isCompleted || item.payment) {
                    earnings += item.amount
                }
            })

            return {earnings, patients, appointments}


        } catch (error) {
            logger.error(__filename, "getDoctorDashboard", "", "Error while getting doctor dashboard data")
            throw error;
        }
    }

}

export default new DashboardService()