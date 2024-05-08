import { Service } from "typedi";
import Partner from "../models/partner.model";
import {
  CreatePartnerInput,
  UpdatePartnerInput,
} from "../schemas/partner.schemas";
import { Types } from "mongoose";

@Service()
export default class PartnerRepository {
  async getPartners() {
    return await Partner.find();
  }

  async createPartner(partner: CreatePartnerInput["body"]) {
    return await Partner.create(partner);
  }

  async getPartner({ partnerId, name }: { partnerId?: string; name?: string }) {
    return await Partner.findOne({
      $or: [{ _id: new Types.ObjectId(partnerId) }, { name }],
    });
  }

  async updatePartner(partnerId: string, update: UpdatePartnerInput["body"]) {
    await Partner.findByIdAndUpdate(partnerId, update);
  }
}
