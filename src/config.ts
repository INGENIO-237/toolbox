import { config } from "dotenv";
import { ENV } from "./utils/enums/common";

config();

export default {
  // NODE_ENV: process.env.NODE_ENV,
  APP_ENV: process.env.APP_ENV,
  PORT: process.env.PORT ? process.env.PORT : 8000,
  DB_CONNECTION_STRING:
    process.env.APP_ENV == ENV.PRODUCTION
      ? (process.env.DB_ATLAS as string)
      : (process.env.DB_CONNECTION_STRING as string),
  SALT_FACTOR: parseInt(process.env.SALT_FACTOR as string),
  SWAGGER_SERVER:
    process.env.APP_ENV == ENV.PRODUCTION
      ? (process.env.PRODUCTION_SERVER as string)
      : (process.env.DEVELOPMENT_SERVER as string),

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
  STRIPE_PUBLIC_KEY:
    process.env.APP_ENV == ENV.PRODUCTION
      ? (process.env.STRIPE_PUBLIC_KEY_LIVE as string)
      : (process.env.STRIPE_PUBLIC_KEY_TEST as string),
  STRIPE_SECRET_KEY:
    process.env.APP_ENV == ENV.PRODUCTION
      ? (process.env.STRIPE_SECRET_KEY_LIVE as string)
      : (process.env.STRIPE_SECRET_KEY_TEST as string),
  STRIPE_API_VERSION: process.env.STRIPE_API_VERSION as string,
  STRIPE_WEBHOOK_ENDPOINT_SECRET: (process.env.APP_ENV === ENV.PRODUCTION
    ? process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET_LIVE
    : process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET_TEST) as string,

  /**
   * PARTNERS
   */

  // NOTCHPAY
  NOTCHPAY_BASE_URL: process.env.NOTCHPAY_BASE_URL as string,
  NOTCHPAY_REFERENCE: process.env.NOTCHPAY_REFERENCE as string,
  NOTCHPAY_PUBLIC_KEY:
    process.env.APP_ENV == ENV.PRODUCTION
      ? (process.env.NOTCHPAY_PUBLIC_KEY_LIVE as string)
      : (process.env.NOTCHPAY_PUBLIC_KEY_TEST as string),
  NOTCHPAY_SECRET_KEY:
    process.env.APP_ENV === ENV.PRODUCTION
      ? (process.env.NOTCHPAY_SECRET_KEY_LIVE as string)
      : (process.env.NOTCHPAY_SECRET_KEY_TEST as string),
  NOTCHPAY_WEBHOOK_SECRET_HASH:
    process.env.APP_ENV === ENV.PRODUCTION
      ? (process.env.NOTCHPAY_WEBHOOK_SECRET_HASH_LIVE as string)
      : (process.env.NOTCHPAY_WEBHOOK_SECRET_HASH_TEST as string),
  DEFAULT_RECIPIENT_EMAIL: process.env
    .DEFAULT_RECIPIENT_EMAIL as string,
};
