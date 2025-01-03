import { logger } from "../../utils/logger";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ERROR_MESSAGE } from "../../constant/message";
import { IAdmin, ILoginData } from "./interface/auth.interface";
import AdminRepository from "../../database/repositories/AdminRepository";

class AuthService {

    /**
     * Compare the password.
     * @param password
     * @param hashedPassword 
     * @returns 
     */

    async comparePassword(password: string, hashedPassword: string) {
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;
        } catch (error) {
            logger.error(__filename, "comparePassword", "", "Error occurred while comparing password", { error });
            throw error;
        }
    }

    /**
     * Generate token.
     * @param adminId 
     * @returns 
     */

    async generateToken(adminId: string) {
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error(ERROR_MESSAGE.JWT_SECRET_NOT_SET);
            }
            return jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN as string });
        } catch (error) {
            logger.error(__filename, "generateToken", "", "Error occurred while generating token", { error });
            throw error;
        }
    }

    /**
     * Get admin by email.
     * @param loginPayload
     * @returns 
     */

    async getAdminByEmail(loginPayload: ILoginData): Promise<IAdmin | null> {
        try {
            const email = loginPayload.email;
            const admin = await AdminRepository.findAdminByEmail(email);
            return admin || null;
        } catch (error) {
            logger.error(__filename, "getAdminByEmail", "", "Error occurred while getting admin by email", { error });
            throw error;
        }
    }
}

export default new AuthService();