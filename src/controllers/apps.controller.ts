import { Service } from "typedi";
import AppsService from "../services/apps.services";
import { Request, Response } from "express";
import HTTP from "../utils/constants/http.responses";
import { RegisterAppInput, UpdateAppInput } from "../schemas/apps.schemas";

@Service()
export default class AppsController {
  constructor(private service: AppsService) {}

  async getApps(req: Request, res: Response) {
    const apps = await this.service.getApps();

    return res.status(HTTP.OK).json(apps);
  }

  async registerApp(
    req: Request<{}, {}, RegisterAppInput["body"]>,
    res: Response
  ) {
    const app = await this.service.registerApp(req.body);

    return res.status(HTTP.CREATED).json(app);
  }

  async updateApp(
    req: Request<UpdateAppInput["params"], {}, UpdateAppInput["body"]>,
    res: Response
  ) {
    await this.service.updateApp(req.params.appId, req.body);

    return res.sendStatus(HTTP.OK);
  }
}
