import { Request, Response } from "express";
import { IApiResponse } from "../../utils/helper/interface/responseInterface";
import { ILoginData, IUserData, LoginResponse } from "./interface/auth.interface";
import authService from "./auth.service";
import { ERROR_MESSAGE, GLOBAL_MESSAGE, SUCCESS_MESSAGE } from "../../constant/message";
import { logger } from "../../utils/logger";
import { ResponseHandler } from "../../utils/helper";
import UserRepository from "../../database/repositories/UserRepository";
import { CustomRequest } from "../../middleware/authMiddleware";



class AuthController {

    /**
     * Register User
     * @param req 
     * @param res 
     * @returns 
     */
    async registerUser(req: Request, res: Response): Promise<IApiResponse | any> {
        try {
            const {
                firstName,
                lastName,
                email,
                password,
            }: IUserData = req.body;

            // Check if a user with the same email already exists
            const existingDoctor = await UserRepository.findUserByEmail(email)
            if (existingDoctor) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.EXISTING_EMAIL, ERROR_MESSAGE.EXISTING_EMAIL);
            }
            
            const hashedPassword = await authService.convertPlainTextToHash(password);
            const userData: IUserData = {
                firstName,
                lastName,
                email,
                password: hashedPassword,

            }

            const user = await authService.registerUser(userData);
            const token = await authService.generateToken(user.id)
            logger.info(__filename, "registerUser", "", SUCCESS_MESSAGE.USER_REGISTER, { user, token })
            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.USER_REGISTER, { user, token });

        } catch (error) {
            logger.error(__filename, "registerUser", "", GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error);
        }
    }

    /**
    * This function is used to login the user.
    * @param req 
    * @param res 
    * @returns 
    */

    async login(req: Request, res: Response): Promise<LoginResponse | any> {
        try {
            logger.info(__filename, req.method, "", `Incoming request from ${req.originalUrl}`, "");

            const loginPayload: ILoginData = req.body;

            // Get user by email.
            const user = await authService.getUserByEmail(loginPayload);

            if (!user) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.INVALID_CREDENTIALS, ERROR_MESSAGE.INVALID_CREDENTIALS);
            }

            // Compare the password.
            const isMatch = await authService.comparePassword(loginPayload.password, user.password);

            if (!isMatch) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.INVALID_CREDENTIALS, ERROR_MESSAGE.INVALID_CREDENTIALS);
            }

            // send Token
            const doctorId: string = user.id
            const token = await authService.generateToken(doctorId)

            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.LOGIN_SUCCESS, { token });
        } catch (error) {
            logger.error(__filename, req.method, "", "Error occurred while logging in.", error);
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }

    /**
     * This function is used to get the user profile.
     * @param req 
     * @param res 
     * @returns 
     */

    async userProfile(req: Request, res: Response): Promise<IApiResponse | any> {
        try {
            const customReq = req as CustomRequest
            logger.info(__filename, req.method, "", `Incoming request from ${req.originalUrl}`, "");
            const { userId } = customReq.body
            if (!userId) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.ID_NOT_FOUND)
            }
            const user = await authService.getUserById(userId)
            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.USER_PROFILE, user)
        } catch (error) {
            logger.error(__filename, req.method, "", "Error occurred while getting user profile.", error);
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }

    async updateUserProfile(req: Request, res: Response): Promise<IApiResponse | any> {
        try {
            const customReq = req as CustomRequest
            logger.info(__filename, req.method, "", `Incoming request from ${req.originalUrl}`, "");
            const { userId, firstName, lastName, phone, address, dob, gender } = customReq.body
            const imageFile = customReq.file;

            if (!imageFile) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.IMAGE_NOT_FOUND, ERROR_MESSAGE.IMAGE_NOT_FOUND)
            }
            const user = await authService.updateUserProfile(userId, firstName, lastName, phone, address, dob, gender, imageFile.buffer)
            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.USER_PROFILE_UPDATED, user)
        } catch (error) {
            logger.error(__filename, req.method, "", "Error occurred while updating user profile.", error);
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }

}

export default new AuthController()