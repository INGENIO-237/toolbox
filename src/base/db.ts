import mongoose from "mongoose";
import config from "../config";
import logger from "../utils/logger";
import localStorage from "../utils/localStorage";
import seedDb from "../seeds/seed";

export default async function connectToDatabase() {
  try {
    await mongoose.connect(config.DB_CONNECTION_STRING);
    logger.info("Connected to DB");
    const launched = localStorage.getItem("launched");

    if (!launched) {
      await seedDb();
      localStorage.setItem("launched", JSON.stringify(true));
    }
  } catch (error) {
    logger.error(error);
    setTimeout(connectToDatabase, 5000);
  }
}
