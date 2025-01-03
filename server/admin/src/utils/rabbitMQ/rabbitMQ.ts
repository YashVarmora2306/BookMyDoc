import amqp, { Channel, Connection } from "amqplib"
import { logger } from "../logger";

class RabbitMQService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    /**
   * Connects to RabbitMQ and initializes a channel.
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
   * @param message - The message to be sent.
   */

    async sendMessage(queueName: string, message: string) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel!.assertQueue(queueName, { durable: true });
            await this.channel!.sendToQueue(queueName, Buffer.from(message), { persistent: true });
            logger.info(__filename, "sendMessage", "", `Message sent to queue ${queueName}.`);
        } catch (error) {
            logger.error(__filename, "sendMessage", "", `Error sending message to queue ${queueName}:`, error);
            throw error;
        }
    }

    /**
     * Consumes messages from the specified queue.
     * @param queueName - The name of the queue to consume messages from.
     * @param callback - The callback function to process the message.
     */
    async consumeMessage(queueName: string, callback: (message: string) => void) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel!.assertQueue(queueName, { durable: true });
            await this.channel!.consume(queueName, (msg) => {
                if (msg) {
                    const message =JSON.parse( msg.content.toString());
                    callback(message);
                    this.channel!.ack(msg);
                }
            });
            logger.info(__filename, "consumeMessage", "", `Consuming messages from queue ${queueName}.`);
        } catch (error) {
            logger.error(__filename, "consumeMessage", "", `Error consuming messages from queue ${queueName}:`, error);
            throw error;
        }
    }

    /**
   * Closes the RabbitMQ connection.
   */

    async close() {
            try {
                if (this.channel) {
                    await this.channel.close();
                    logger.info(__filename, "", "", "RabbitMQ channel closed")
                }
                if (this.connection) {
                    await this.connection.close();
                    logger.info(__filename, "", "", "RabbitMQ connection closed")
                }
            } catch (error) {
                logger.error(__filename, "", "", `Error closing RabbitMQ connection: `, error);
            }
        }

    }

export default new RabbitMQService()