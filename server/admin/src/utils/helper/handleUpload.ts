import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary";

/**
 * Handles the upload of a file buffer to Cloudinary.
 * @param fileBuffer - The file buffer to upload.
 * @returns The secure URL of the uploaded image.
 */

const handleUpload = async (fileBuffer: Buffer): Promise<string> => {

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('No result in cloudinary upload'))
                }
                resolve(result.secure_url);
            }
        )
        uploadStream.end(fileBuffer);
    })
}

export default handleUpload;