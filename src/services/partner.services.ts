import { Service } from "typedi";
import PartnerRepository from "../repositories/partner.repository";
import { CreatePartnerInput } from "../schemas/partner.schemas";

@Service()
export default class PartnerService {
  constructor(private repository: PartnerRepository) {}

  async getPartners() {
    return await this.repository.getPartners();
  }

  async createPartner(partner: CreatePartnerInput["body"]) {
    return await this.repository.createPartner(partner);
  }
}
