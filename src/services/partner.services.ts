import { Service } from "typedi";
import PartnerRepository from "../repositories/partner.repository";
import { CreatePartnerInput } from "../schemas/partner.schemas";
import { PartnerDocument } from "../models/partner.model";
import ApiError from "../utils/errors/errors.base";
import COMMON_MSG from "../utils/constants/common.msgs";
import HTTP from "../utils/constants/http.responses";

@Service()
export default class PartnerService {
  constructor(private repository: PartnerRepository) {}

  async getPartners() {
    return await this.repository.getPartners();
  }

  async createPartner(partner: CreatePartnerInput["body"]) {
    const nameIsUnique = await this.nameIsUnique({ name: partner.name });

    if (!nameIsUnique) {
      throw new ApiError(COMMON_MSG.inUse("Name"), HTTP.BAD_REQUEST);
    }

    return await this.repository.createPartner(partner);
  }

  async getPartner({ partnerId, name }: { partnerId?: string; name?: string }) {
    return await this.repository.getPartner({ partnerId, name });
  }

  private async nameIsUnique({
    partnerId,
    name,
  }: {
    partnerId?: string;
    name: string;
  }) {
    const partner = (await this.getPartner({ name })) as PartnerDocument;

    if (!partnerId && partner) return false;

    if (!partner) return true;

    return partner._id.toString() === partnerId;
  }
}
