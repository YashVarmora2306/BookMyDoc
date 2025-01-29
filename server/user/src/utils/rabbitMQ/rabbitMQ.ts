import amqp, { Channel, Connection, ConsumeMessage } from "amqplib"
import { logger } from "../logger";

class RabbitMQService {

    private connection: Connection | null = null;
    private channel: Channel | null = null;

    /**
     * Connects to RabbitMQ and initializes a channel.
     * 
    */

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBIT_URL as string);
            this.channel = await this.connection.createChannel();
            logger.info(__filename, "", "", "Connected to RabbitMQ.")
        } catch (error) {
            logger.error(__filename, "", "", `Error connecting to RabbitMQ: `, error);
            throw error;
        }
    }

    /**
     * Sends a message to the specified queue.
     * @param queueName - The name of the queue to send the message to.
     * @param data - data to be sent.
     */

    async publishToQueue(queueName: string, data: any) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel!.assertQueue(queueName, { durable: true });
            await this.channel!.sendToQueue(queueName, Buffer.from(data), { persistent: true });
            logger.info(__filename, "publishToQueue", "", `Message sent to ${queueName}.`);
        } catch (error) {
            logger.error(__filename, "publishToQueue", "", `Error sending message to ${queueName}:`, error);
            throw error;
        }
    }

    /**
     * Subscribes to the specified queue.
     * @param queueName - The name of the queue to subscribe to.
     * @param callback - The callback function to process the message.
     */

    async subscribeToQueue(queueName: string, callback: (message: string) => void) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel!.assertQueue(queueName, { durable: true });
            const consumerTag = await this.channel!.consume(queueName, (msg: ConsumeMessage | null) => {
                if (msg) {
                    const message = msg.content.toString();
                    callback(message);
                    this.channel!.ack(msg);
                } else {
                    logger.error(__filename, "subscribeToQueue", "", `Error consuming message from ${queueName}:`, "No message found");
                }
            })
            logger.info(__filename, "subscribeToQueue", "", `Subscribed to ${queueName}.`);
            return consumerTag.consumerTag;
        } catch (error) {
            logger.error(__filename, "subscribeToQueue", "", `Error subscribing to ${queueName}:`, error);
            throw error;
        }
    }


    /**
     * Unsubscribes from the specified queue.
     * @param consumerTag - The consumer tag to unsubscribe from the queue.
     */

    async unsubscribeFromQueue(consumerTag: string) {
        try {
            if (this.channel) {
                await this.channel.cancel(consumerTag);
                logger.info(__filename, "unsubscribeFromQueue", "", `Unsubscribed from queue with consumer tag ${consumerTag}.`);
            }
        } catch (error) {
            logger.error(__filename, "unsubscribeFromQueue", "", `Error unsubscribing from queue with consumer tag ${consumerTag}:`, error);
            throw error;
        }
    }

}

export default new RabbitMQService()