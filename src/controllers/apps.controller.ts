import { Service } from "typedi";
import AppsService from "../services/apps.services";
import { Request, Response } from "express";
import HTTP from "../utils/constants/http.responses";
import { registerAppInput } from "../schemas/apps.schemas";

@Service()
export default class AppsController {
  constructor(private service: AppsService) {}

  async getApps(req: Request, res: Response) {
    const apps = await this.service.getApps();

    return res.status(HTTP.OK).json(apps);
  }

  async registerApp(req: Request<{}, {}, registerAppInput["body"]>, res: Response) {
    const app = await this.service.registerApp(req.body);

    return res.status(HTTP.CREATED).json(app);
  }
}
