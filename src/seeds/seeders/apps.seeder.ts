import "reflect-metadata";
import logger from "../../utils/logger";
import Container from "typedi";
import AppsService from "../../services/apps.services";
import { apps } from "../placeholder-data";

const service = Container.get(AppsService);

export default async function seedApps() {
  logger.info("Seeding apps...");
  const response = await Promise.all(
    apps.map(async (app) => await service.registerApp(app))
  );
  logger.info(`Seed ${response.length} apps`);
}
