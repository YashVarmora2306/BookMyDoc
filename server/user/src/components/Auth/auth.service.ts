import bcrypt from "bcryptjs";
import { logger } from "../../utils/logger";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGE } from "../../constant/message";
import { ILoginData, IUser, IUserData } from "./interface/auth.interface";
import UserRepository from "../../database/repositories/UserRepository";
import { User } from "../../database/entities/User";
import handleUpload from "../../utils/helper/handleUpload";

class AuthService{

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
     * Register the user.
     * @param userData 
     * @returns 
     */

    async registerUser(userData: IUserData): Promise<IUser>{
        try {

            const UserData = new User
            UserData.firstName = userData.firstName;
            UserData.lastName = userData.lastName;
            UserData.email = userData.email;
            UserData.password = userData.password

            const user = UserRepository.createUser(UserData)
            return user

        } catch (error) {
            logger.error(__filename, 'registerUser', '', 'Error occurred', error);
            throw error
        }
    }

    /**
     * Get user by email.
     * @param loginPayload
     * @returns 
     */

    async getUserByEmail(loginPayload: ILoginData): Promise<IUser | null> {
        try {
            const email = loginPayload.email;
            const doctor = await UserRepository.findUserByEmail(email);
            return doctor || null;
        } catch (error) {
            logger.error(__filename, "getDoctorByEmail", "", "Error occurred while getting doctor by email", { error });
            throw error;
        }
    }

    /**
     * Get user by id.
     * @param userId 
     */

    async getUserById(userId: string): Promise<IUser | null> {
        try {
            const doctor = await UserRepository.findUserById(userId);
            return doctor || null;
        } catch (error) {
            logger.error(__filename, "getDoctorById", "", "Error occurred while getting doctor by id", { error });
            throw error;
        }
    }

    /**
     * Update user Profile
     * @param userId 
     * @param data 
     * @returns 
     */

    async updateUserProfile(userId: string, firstName:string, lastName:string, phone: string, address:string, dob:string, gender:string, imageFile: Buffer): Promise<IUser | null> {
        try {
            const profilePicture = await handleUpload(imageFile)
            const updatedUser = await UserRepository.findUserByIdAndUpdate(userId, {
                firstName, lastName, phone, address: JSON.parse(address), dob, gender, profilePicture
            });
            return updatedUser || null;
        } catch (error) {
            logger.error(__filename, "updateUserProfile", "", "Error occurred while updating user profile",
                { error });
            throw error;
        }
    }

}

export default new AuthService()