import { Service } from "typedi";
import Partner from "../models/partner.model";
import { CreatePartnerInput } from "../schemas/partner.schemas";

@Service()
export default class PartnerRepository {
  async getPartners() {
    return await Partner.find();
  }

  async createPartner(partner: CreatePartnerInput["body"]) {
    return await Partner.create(partner);
  }
}
