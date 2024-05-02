import { config } from "dotenv";

config();

export default {
  PORT: process.env.PORT ? process.env.PORT : 8000,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING as string,
  SALT_FACTOR: parseInt(process.env.SALT_FACTOR as string),
  ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY: process.env.REFRESH_TOKEN_PUBLIC_KEY,
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,

  // Mail confs
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT ? process.env.MAIL_PORT : 465,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PWD: process.env.MAIL_PWD,
  MAIL_SENDER: process.env.MAIL_SENDER,

  // Cloudinary
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_API_CLOUD_NAME: process.env.CLOUDINARY_API_CLOUD_NAME,
};
