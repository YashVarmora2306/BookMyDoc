import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGE, GLOBAL_MESSAGE } from "../constant/message";
import { ResponseHandler } from "../utils/helper";
import { logger } from "../utils/logger";
import UserRepository from '../database/repositories/UserRepository';

export interface CustomRequest extends Request {
    UserId: string;
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

        // Verify the token and get the user
        const token = authorization.split(' ')[1];

        if (!token) {
            return ResponseHandler.error(res, 401, GLOBAL_MESSAGE.UNAUTHORIZED, GLOBAL_MESSAGE.UNAUTHORIZED);
        }

        const userTokenData = verifyToken(token);

        if (!userTokenData) {
            return ResponseHandler.error(res, 401, GLOBAL_MESSAGE.UNAUTHORIZED, GLOBAL_MESSAGE.UNAUTHORIZED);
        }

        // Check if the User exists
        const currentUser = await UserRepository.findUserById(userTokenData.userId)
        if (!currentUser) {
            return ResponseHandler.error(res, 401, GLOBAL_MESSAGE.UNAUTHORIZED, GLOBAL_MESSAGE.UNAUTHORIZED);
        }

        // Attach the user to the request
        customReq.body.userId = currentUser.id;

        next();
    } catch (error) {
        logger.error(__filename, req.method, '', 'Error occurred', error);
        return ResponseHandler.error(res, 500, GLOBAL_MESSAGE.INTERNAL_SERVER_ERROR, error);
    }
}

export { authMiddleware }