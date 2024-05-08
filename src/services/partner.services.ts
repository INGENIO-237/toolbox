import { Service } from "typedi";
import PartnerRepository from "../repositories/partner.repository";
import {
  CreatePartnerInput,
  UpdatePartnerInput,
} from "../schemas/partner.schemas";
import { PartnerDocument } from "../models/partner.model";
import ApiError from "../utils/errors/errors.base";
import COMMON_MSG from "../utils/constants/common.msgs";
import HTTP from "../utils/constants/http.responses";
import { Types } from "mongoose";
import isValidID from "../utils/check-id";

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
  
  async getPartner({
    partnerId,
    name,
    throwExpection = false,
  }: {
    partnerId?: string;
    name?: string;
    throwExpection?: boolean;
  }) {
    if (partnerId) {
      isValidID(partnerId);
    }

    const partner = await this.repository.getPartner({ partnerId, name });

    if (!partner && throwExpection) {
      throw new ApiError(COMMON_MSG.notFound("Partner"), HTTP.NOT_FOUND);
    }

    return partner;
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

  async updatePartner(partnerId: string, update: UpdatePartnerInput["body"]) {
    const partner = await this.getPartner({ partnerId, throwExpection: true });

    if (update.name) {
      const nameIsUnique = await this.nameIsUnique({ name: update.name });

      if (!nameIsUnique) {
        throw new ApiError(COMMON_MSG.inUse("Name"), HTTP.BAD_REQUEST);
      }
    }

    await this.repository.updatePartner(partner?._id.toString(), update);
  }
}
