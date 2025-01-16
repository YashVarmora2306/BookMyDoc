import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ResponseHandler } from "../utils/helper";


const validateMiddleware = (req: Request, res: Response, next: NextFunction): any => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ResponseHandler.error(res, 400, "Validation Error: ", errors.array().map((err) => err.msg).join(", "));
    }
    next();
}

export default validateMiddleware;