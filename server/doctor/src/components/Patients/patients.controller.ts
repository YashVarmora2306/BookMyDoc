import { RABBITMQ_QUEUE_NAME, SUCCESS_MESSAGE } from "../../constant/message"
import { logger } from "../../utils/logger"
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ"
import patientsService from "./patients.service"


class PatientsController {

    async getDoctor() {
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.GET_DOCTOR_BY_ID_QUEUE, async (message: string) => {
                const doctor = await patientsService.getDoctorById(message)
                const reply = JSON.stringify({
                    status: "success",
                    message: SUCCESS_MESSAGE.SUCCESSFULLY_RETRIEVED_DOCTORS,
                    data: JSON.stringify(doctor)
                })
                await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_REPLY_QUEUE, reply);
                logger.info(__filename, "SubscribeToGetDoctor", "", "Get doctor request processed")
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
                        await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.DOCTOR_REPLY_QUEUE, reply);
            
                        logger.error(__filename, "SubscribeToGetDoctor", "", "Error processing get doctor")
            
        }
    }

    async updateDoctor() { 
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.UPDATE_DOCTOR_QUEUE, async (message: string) => { 
                const doctor = await patientsService.updateDoctor(JSON.parse(message))
                logger.info(__filename, "SubscribeToUpdateDoctor", "", "Update doctor request processed", doctor)
            })
        } catch (error) {
            logger.error(__filename, "SubscribeToUpdateDoctor", "", "Error processing update doctor", error)
        }
    }
}

export default new PatientsController()