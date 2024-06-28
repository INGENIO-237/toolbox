import "reflect-metadata";

import Container from "typedi";
import logger from "../../utils/logger";
import PartnerService from "../../services/partner.services";
import { partners } from "../placeholder-data";

const service = Container.get(PartnerService);

export default async function seedPartners() {
  logger.info("Seeding partners...");
  const response = await Promise.all(
    partners.map(async (partner) => await service.createPartner(partner))
  );
  logger.info(`Seed ${response.length} partners`);
}
