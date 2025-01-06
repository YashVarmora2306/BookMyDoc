import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGE, GLOBAL_MESSAGE } from "../constant/message";
import { ResponseHandler } from "../utils/helper";
import { logger } from "../utils/logger";
import DoctorRepository from '../database/repositories/DoctorRepository';

export interface CustomRequest extends Request {
    doctorId: string;
    iat: number;
    currentDoctor: any;
}

// verify the token
function verifyToken(token: string) {
    try {
        // Check if not set JWT_SECRET in environment
        if (!process.env.JWT_SECRET) {
            throw new Error(ERROR_MESSAGE.JWT_SECRET_NOT_SET);
        }

        // Verify the token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        return decoded;
    } catch (error) {
        return null;
    }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const customReq = req as CustomRequest;
        // Check if the token is present in the request
        const { authorization } = req.headers;

        if (!authorization) {
            return ResponseHandler.error(res, 401, GLOBAL_MESSAGE.UNAUTHORIZED, GLOBAL_MESSAGE.UNAUTHORIZED);
        }

        // Verify the token and get the doctor
        const token = authorization.split(' ')[1];

        if (!token) {
            return ResponseHandler.error(res, 401, GLOBAL_MESSAGE.UNAUTHORIZED, GLOBAL_MESSAGE.UNAUTHORIZED);
        }

        const doctorTokenData = verifyToken(token);

        if (!doctorTokenData) {
            return ResponseHandler.error(res, 401, GLOBAL_MESSAGE.UNAUTHORIZED, GLOBAL_MESSAGE.UNAUTHORIZED);
        }

        // Check if the doctor exists
        const currentDoctor = await DoctorRepository.findDoctorById(doctorTokenData.doctorId)

        if (!currentDoctor) {
            return ResponseHandler.error(res, 401, GLOBAL_MESSAGE.UNAUTHORIZED, GLOBAL_MESSAGE.UNAUTHORIZED);
        }

        // Attach the doctor to the request
        customReq.body.doctorId = currentDoctor.id;

        next();
    } catch (error) {
        logger.error(__filename, req.method, '', 'Error occurred', error);
        return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error);
    }
}

export { authMiddleware }