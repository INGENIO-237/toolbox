import mongoose from "mongoose";
import config from "../config";
import logger from "../utils/logger";

export default async function connectToDatabase() {
  try {
    await mongoose.connect(config.DB_CONNECTION_STRING);
    logger.info("Connected to DB");
  } catch (error) {
    logger.error(error);
    setTimeout(connectToDatabase, 5000);
  }
}
