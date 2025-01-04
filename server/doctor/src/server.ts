import dotenv from "dotenv";
import "reflect-metadata";
import app from "./app";
import { logger } from "./utils/logger";
import initializeDatabase from "./database/initialization/dbInitialization";
import doctorController from "./components/Doctor/doctor.controller";
import rabbitMQ from "./utils/rabbitMQ/rabbitMQ";

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
        try {
            await doctorController.subscribeToDoctorQueue();
            logger.info(__filename, "Main", "", "Doctor queue subscription initialized.");
        } catch (error) {
            logger.error(__filename, "Main", "", "Failed to initialize queue subscription:", error);
        }

    } catch (error) {
        logger.error(__filename, "", "", `Failed to start the server: ${error}`, { error });
        process.exit(1);
    }
})()