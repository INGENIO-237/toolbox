import { Service } from "typedi";
import Partner from "../models/partner.model";
import {
  CreatePartnerInput,
  UpdatePartnerInput,
} from "../schemas/partner.schemas";
import { Types } from "mongoose";
import { COUNTRY_CODE } from "../utils/enums/common";

@Service()
export default class PartnerRepository {
  async getPartners() {
    return await Partner.find();
  }

  async createPartner(partner: CreatePartnerInput["body"]) {
    return await Partner.create(partner);
  }

  async getPartner({
    partnerId,
    name,
    method,
    country,
  }: {
    partnerId?: string;
    name?: string;
    method?: string;
    country?: COUNTRY_CODE;
  }) {
    return await (method && country
      ? Partner.findOne({
          $and: [{ "methods.name": method }, { "methods.countries": country }],
        })
      : // Partner.findOne({
        //   methods: {
        //     $elemMatch: { name: method, countries: { $in: [country] } },
        //   },
        // })
        Partner.findOne({
          $or: [{ _id: new Types.ObjectId(partnerId) }, { name }],
        }));
  }

  async updatePartner(partnerId: string, update: UpdatePartnerInput["body"]) {
    await Partner.findByIdAndUpdate(partnerId, update);
  }
}
