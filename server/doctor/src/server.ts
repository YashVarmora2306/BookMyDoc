import dotenv from "dotenv";
import "reflect-metadata";
import app from "./app";
import { logger } from "./utils/logger";
import initializeDatabase from "./database/initialization/dbInitialization";
import rabbitMQ from "./utils/rabbitMQ/rabbitMQ";
import { RABBITMQ_QUEUE_NAME } from "./constant/message";

dotenv.config({ path: `${__dirname}/../.env` });

const PORT: number = Number(process.env.PORT) || 5002;

(async () => {
    try {
        await app.listen(PORT, () => {
            logger.info(__filename, "", "", `Server is running on port ${PORT}`, "");
        });

        await initializeDatabase();
        logger.info(__filename, "", "", "Connected to postgres database successfully", "");

        await rabbitMQ.connect();
        await rabbitMQ.consumeMessages(RABBITMQ_QUEUE_NAME.DOCTOR_QUEUE);

    } catch (error) {
        logger.error(__filename, "", "", `Failed to start the server: ${error}`, { error });
        process.exit(1);
    }
})()