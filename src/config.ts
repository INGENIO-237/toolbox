import { config } from "dotenv";

config();

export default {
  PORT: process.env.PORT ? process.env.PORT : 8000,
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING as string,
  SALT_FACTOR: parseInt(process.env.SALT_FACTOR as string),
  PRODUCTION_SERVER: process.env.PRODUCTION_SERVER as string,

  // TOKENS
  ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY: process.env.REFRESH_TOKEN_PUBLIC_KEY,
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,

  // MAIL
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT ? process.env.MAIL_PORT : 465,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PWD: process.env.MAIL_PWD,
  MAIL_SENDER: process.env.MAIL_SENDER,

  // TWILIO
  TWILIO_SID: process.env.TWILIO_SID as string,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER as string,

  // STRIPE
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  STRIPE_API_VERSION: process.env.STRIPE_API_VERSION as string,
  STRIPE_WEBHOOK_ENDPOINT_SECRET: (process.env.NODE_ENV === "production"
    ? process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET_LIVE
    : process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET_TEST) as string,
};
