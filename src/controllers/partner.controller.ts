import { Request, Response } from "express";
import { Service } from "typedi";
import PartnerService from "../services/partner.services";
import {
  CreatePartnerInput,
  UpdatePartnerInput,
} from "../schemas/partner.schemas";
import HTTP from "../utils/constants/http.responses";

@Service()
export default class PartnerController {
  constructor(private service: PartnerService) {}

  async getPartners(req: Request, res: Response) {
    const partners = await this.service.getPartners();

    return res.status(HTTP.OK).json(partners);
  }

  async createPartner(
    req: Request<{}, {}, CreatePartnerInput["body"]>,
    res: Response
  ) {
    const partner = await this.service.createPartner(req.body);

    return res.status(HTTP.CREATED).json(partner);
  }

  async updatePartner(
    req: Request<UpdatePartnerInput["params"], {}, UpdatePartnerInput["body"]>,
    res: Response
  ) {
    await this.service.updatePartner(req.params.partnerId, req.body);

    return res.sendStatus(HTTP.OK);
  }
}
