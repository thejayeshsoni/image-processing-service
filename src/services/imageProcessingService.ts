import sharp from "sharp";
import axios from "axios";
import CloudinaryService from "./cloudinaryService";
import apiController from "../controller/apiController";

const downloadImage = async (urls: string[]) => {
  const downloadSingleImage = async (url: string) => {
    try {
      const response = await axios({
        url,
        responseType: "arraybuffer",
      });
      return Buffer.from(response.data, "binary");
    } catch (error) {
      console.error(`Error downloading image from ${url}:`, error);
      return null;
    }
  };

  const promises = urls.map(downloadSingleImage);
  const images = await Promise.all(promises);

  return images;
};

const compressImage = async (imageBuffer) => {
  return await sharp(imageBuffer).jpeg({ quality: 50 }).toBuffer();
};

export const compressImageJob = async (csvData, reqId) => {
  const cloudinaryService = CloudinaryService.getInstance();
  const updatedCsvData = await Promise.all(
    csvData.map(async (data) => {
      const imageBuffers = await downloadImage(data.urls);
      const compressedImagesURLs = [];
      for (let i = 0; i < imageBuffers.length; i++) {
        if (imageBuffers[i]) {
          const compressedBuffer = await compressImage(imageBuffers[i]);

          // Upload the image buffer to Cloudinary
          const fileName = `${reqId}-${data.serial}-${data.name}-${i}.jpg`;
          const result = await cloudinaryService.uploadImage(
            compressedBuffer,
            fileName
          );
          if (result) {
            console.log(`Image ${fileName} uploaded successfully`);
            compressedImagesURLs.push(result.url);
          }
        }
      }
      return { ...data, compressedImagesURLs };
    })
  );

  await apiController.updateProcessingStatus(reqId, {
    status: "Completed",
    csvData: updatedCsvData,
  });
};
