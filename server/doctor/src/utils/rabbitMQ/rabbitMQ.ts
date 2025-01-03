import amqp, { Connection, Channel } from 'amqplib';
import { logger } from '../logger';
import doctorController from '../../components/Doctor/doctor.controller';

class RabbitMQService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    /**
     * Connects to RabbitMQ and initializes a channel.
     */
    async connect(): Promise<void> {
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
     * Consumes messages from the specified queue.
     * @param queueName - The name of the queue to consume from.
     */
    async consumeMessages(queueName: string) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel!.assertQueue(queueName, { durable: true });
            this.channel!.consume(queueName, async (msg) => {
                if (msg) {
                    const doctorData = JSON.parse(msg.content.toString());
                    await doctorController.registerDoctor(doctorData)
                    this.channel!.ack(msg);
                }
            });
            logger.info(__filename, "consumeMessages", "", `Consuming messages from queue ${queueName}.`);
        } catch (error) {
            logger.error(__filename, "consumeMessages", "", `Error consuming messages from queue ${queueName}: `, error);
            throw error;
        }
    }

    /**
     * Publishes a message to the specified queue.
     * @param queueName - The name of the queue to publish to.
     * @param message - The message to publish.
     */
    async sendMessage(queueName: string, message: string) { 
        try { 
            if (!this.channel) {
                await this.connect();
            }
            this.channel!.assertQueue(queueName, { durable: true });
            this.channel!.sendToQueue(queueName, Buffer.from(message), { persistent: true });
            logger.info(__filename, "publishMessage", "", `Published message to queue ${queueName}.`);
        } catch (error) {
            logger.error(__filename, "publishMessage", "", `Error publishing message to queue ${queueName}: `, error);
            throw error;
        }
    }

    /**
     * Closes the RabbitMQ connection.
     */
    public async close(): Promise<void> {
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
            throw error;
        }
    }
}

export default new RabbitMQService();
