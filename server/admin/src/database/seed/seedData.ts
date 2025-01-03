import { logger } from "../../utils/logger";
import { Admin } from "../entities/Admin";
import AdminRepository from "../repositories/AdminRepository";
import bcrypt from "bcryptjs";

/**
 * Seed the database with initial data (Admin).
 */

export const seedData = async () => {
    try {

        // Count the number of admins already present.
        const adminCount = await AdminRepository.countAdmins();

        if (adminCount === 0) {
            // Seed data for admin if the table is empty.
            const admin = new Admin();
            admin.firstName = process.env.ADMIN_FIRST_NAME as string;
            admin.lastName = process.env.ADMIN_LAST_NAME as string;
            admin.email = process.env.ADMIN_EMAIL as string;

            // Hash the password before saving.

            admin.password = bcrypt.hashSync(process.env.ADMIN_PASSWORD as string, 10);

            // Save the admin to the database.
            await AdminRepository.createAdmin(admin);
            logger.info(__filename, "seedData", "", "Admin Seed Data has been added successfully.", "")
        } else {
            logger.info(__filename, "seedData", "", "Admin table already populated, skipping seed data.", "")
        }
    } catch (error) {
        logger.error(__filename, "seedData", "", `Failed to seed data: ${error}`, { error });
    }
}