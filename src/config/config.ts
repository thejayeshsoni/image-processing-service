import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

export default {
  ENV: process.env.ENV,
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_CLOUD_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
