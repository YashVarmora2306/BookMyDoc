import { logger } from "../../utils/logger";
import AppDataSource from "../config/dbConfig";
const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        logger.info(__filename, "", "", "Database Connection has been established successfully.", "")

    } catch (error) {
        logger.error(__filename, "", "", `Unable to connect to the database: ${error}`, "");
        process.exit(1);
    }
}

export default initializeDatabase;