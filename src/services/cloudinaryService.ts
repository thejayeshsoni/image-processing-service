import { v2 as cloudinary } from "cloudinary";
import config from "../config/config";

class CloudinaryService {
  private static instance: CloudinaryService;
  private cloudinaryInstance: typeof cloudinary;

  private constructor() {
    this.cloudinaryInstance = cloudinary;
    this.cloudinaryInstance.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_CLOUD_API_KEY,
      api_secret: config.CLOUDINARY_CLOUD_API_SECRET,
    });
  }

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  public uploadImage(imageBuffer: Buffer, fileName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cloudinaryInstance.uploader.upload(
        `data:image/jpeg;base64,${imageBuffer.toString("base64")}`,
        {
          public_id: fileName,
          resource_type: "image",
          folder: "compressed-images",
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });
  }
}

export default CloudinaryService;
