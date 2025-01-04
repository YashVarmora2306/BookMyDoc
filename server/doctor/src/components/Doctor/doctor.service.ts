import { ERROR_MESSAGE } from "../../constant/message";
import { Doctor } from "../../database/entities/Doctor";
import DoctorRepository from "../../database/repositories/DoctorRepository";
import { logger } from "../../utils/logger";
import { IDoctorData } from "./interface/doctor.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


class DoctorService {

    // Hash the password
    async convertPlainTextToHash(password: string) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return hashedPassword;
        } catch (error) {
            logger.error(__filename, 'convertPlainTextToHash', '', 'Error occurred', { error });
            throw error;
        }
    }

    // Compare the password
    async comparePassword(password: string, hashedPassword: string) {
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;
        } catch (error) {
            logger.error(__filename, 'comparePassword', '', 'Error occurred', { error });
            throw error;
        }
    }

    // send Token
    async generateToken(userId: string) {
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error(ERROR_MESSAGE.JWT_SECRET_NOT_SET);
            }
            return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        } catch (error) {
            logger.error(__filename, 'generateToken', '', 'Error occurred', { error });
            throw error;
        }
    }

    /**
   * Creates a new doctor in the database.
   * @param doctorData - The doctor data to be saved.
   */
    async createDoctor(doctorData: IDoctorData) {
        try {

            // Check if a doctor with the same email already exists
            const existingDoctor = await DoctorRepository.findDoctorByEmail(doctorData.email)
            if (existingDoctor) {
                throw new Error(ERROR_MESSAGE.EXISTING_EMAIL);
            }

            // Create a new doctor
            const DoctorData = new Doctor
            DoctorData.firstName = doctorData.firstName
            DoctorData.lastName = doctorData.lastName
            DoctorData.email = doctorData.email
            DoctorData.password = doctorData.password
            DoctorData.specialist = doctorData.specialist;
            DoctorData.profilePicture = doctorData.profilePicture;
            DoctorData.degree = doctorData.degree;
            DoctorData.experience = doctorData.experience;
            DoctorData.about = doctorData.about;
            DoctorData.fees = doctorData.fees;
            DoctorData.address = doctorData.address;


            const doctor = await DoctorRepository.createDoctor(DoctorData)

            return doctor;

        } catch (error) {

            logger.error(__filename, 'createDoctor', '', 'Error occurred', { error });

            throw error;
        }
    }
}

export default new DoctorService()