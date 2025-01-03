import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { ResponseHandler } from "../utils/helper";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
})

const multerErrorHandler = (err: any, req: Request, res: Response, next: Function):any => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors (e.g., file too large, file format issues)
        return ResponseHandler.error(res, 400, err.message, err)
    } else if (err instanceof Error) {
        // Handle general errors
        return ResponseHandler.error(res, 400, err.message, err)
    }
    next();
};

export{ upload, multerErrorHandler };