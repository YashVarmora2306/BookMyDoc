import { logger } from "../../utils/logger";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ERROR_MESSAGE } from "../../constant/message";
import { IDoctor, ILoginData } from "./interface/auth.interface";
import DoctorRepository from "../../database/repositories/DoctorRepository";

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
     * @param doctorId 
     * @returns 
     */

    async generateToken(doctorId: string) {
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error(ERROR_MESSAGE.JWT_SECRET_NOT_SET);
            }
            return jwt.sign({ doctorId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN as string });
        } catch (error) {
            logger.error(__filename, "generateToken", "", "Error occurred while generating token", { error });
            throw error;
        }
    }

    /**
     * Get doctor by email.
     * @param loginPayload
     * @returns 
     */

    async getDoctorByEmail(loginPayload: ILoginData): Promise<IDoctor | null> {
        try {
            const email = loginPayload.email;
            const doctor = await DoctorRepository.findDoctorByEmail(email);
            return doctor || null;
        } catch (error) {
            logger.error(__filename, "getDoctorByEmail", "", "Error occurred while getting doctor by email", { error });
            throw error;
        }
    }
}

export default new AuthService();