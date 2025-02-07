import { Request, Response } from "express";
import { ILoginData, LoginResponse } from "./interface/auth.interface";
import { logger } from "../../utils/logger";
import authService from "./auth.service";
import { ResponseHandler } from "../../utils/helper";
import { ERROR_MESSAGE, GLOBAL_MESSAGE, SUCCESS_MESSAGE } from "../../constant/message";
import { IApiResponse } from "../../utils/helper/interface/responseInterface";
import { CustomRequest } from "../../middleware/authMiddleware";


class AuthController {

    /**
     * This function is used to login the doctor.
     * @param req 
     * @param res 
     * @returns 
     */

    async login(req: Request, res: Response): Promise<LoginResponse | any> {
        try {
            logger.info(__filename, req.method, "", `Incoming request from ${req.originalUrl}`, "");

            const loginPayload: ILoginData = req.body;

            // Get doctor by email.
            const doctor = await authService.getDoctorByEmail(loginPayload);

            if (!doctor) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.INVALID_CREDENTIALS, ERROR_MESSAGE.INVALID_CREDENTIALS);
            }

            // Compare the password.
            const isMatch = await authService.comparePassword(loginPayload.password, doctor.password);

            if (!isMatch) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.INVALID_CREDENTIALS, ERROR_MESSAGE.INVALID_CREDENTIALS);
            }

            // send Token
            const doctorId: string = doctor.id
            const token = await authService.generateToken(doctorId)

            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.LOGIN_SUCCESS, {token});
        } catch (error) {
            logger.error(__filename, req.method, "", "Error occurred while logging in.", error);
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }

    /**
     * This function is used to get the doctor profile.
     * @param req 
     * @param res 
     * @returns 
     */

    async DoctorProfile (req: Request, res: Response): Promise<IApiResponse | any>{
        try {
            const customReq = req as CustomRequest
            logger.info(__filename, req.method, "", `Incoming request from ${req.originalUrl}`, "");
            const { doctorId } = customReq.body
            if (!doctorId) {
                return ResponseHandler.error(res, 400, ERROR_MESSAGE.ID_NOT_FOUND)
            }
            const doctor = await authService.getDoctorById(doctorId)
            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.DOCTOR_PROFILE, doctor)
        } catch (error) {
            logger.error(__filename, req.method, "", "Error occurred while getting doctor profile.", error);
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }

    async updateDoctorProfile(req: Request, res: Response): Promise<IApiResponse | any>{
        try {
            const customReq= req as CustomRequest
            logger.info(__filename, req.method, "", `Incoming request from ${req.originalUrl}`, "");
            const { doctorId, fees, address, available } = customReq.body
            const doctor = await authService.updateDoctorProfile(doctorId, fees, address, available)
            return ResponseHandler.success(res, 200, SUCCESS_MESSAGE.DOCTOR_PROFILE_UPDATED, doctor)
        } catch (error) {
            logger.error(__filename, req.method, "", "Error occurred while updating doctor profile.", error);
            return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error)
        }
    }
}

export default new AuthController();