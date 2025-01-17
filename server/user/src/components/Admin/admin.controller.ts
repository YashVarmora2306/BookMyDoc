import { RABBITMQ_QUEUE_NAME, SUCCESS_MESSAGE } from "../../constant/message";
import { logger } from "../../utils/logger";
import rabbitMQ from "../../utils/rabbitMQ/rabbitMQ";
import adminService from "./admin.service";


class AdminController {

    /**
     * Handel get all user.
     */

    async GetAllUsers() {
        try {
            await rabbitMQ.subscribeToQueue(RABBITMQ_QUEUE_NAME.GET_USERS_QUEUE, async (message: string) => {
                logger.info(__filename, "SubscribeToGetAllUsers", "", "Processing get all users request.")
                const users = await adminService.getAllUsers();
                const reply = JSON.stringify({
                    status: "success",
                    message: SUCCESS_MESSAGE.SUCCESSFULLY_RETRIEVED_USERS,
                    data: JSON.stringify(users)
                }
                )
                await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.USER_REPLY_QUEUE, reply);
                logger.info(__filename, "SubscribeToGetAllUsers", "", "Get all users request processed")
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
            await rabbitMQ.publishToQueue(RABBITMQ_QUEUE_NAME.USER_REPLY_QUEUE, reply);
            logger.error(__filename, "SubscribeToGetAllUsers", "", "Error processing get all users")

        }
    }
}

export default new AdminController()