import "reflect-metadata";
import Container from "typedi";
import UserService from "../../services/user.services";
import logger from "../../utils/logger";
import { users } from "../placeholder-data";

const service = Container.get(UserService);

export default async function seedUsers() {
  logger.info("Seeding users...");

  const response = await Promise.all(
    users.map(async (user) => await service.createUser(user))
  );

  logger.info(`Seeded ${response.length} users`);
}
