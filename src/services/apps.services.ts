import { Service } from "typedi";
import AppsRepository from "../repositories/apps.repository";
import { registerAppInput } from "../schemas/apps.schemas";
import { v4 } from "uuid";

@Service()
export default class AppsService {
  constructor(private repository: AppsRepository) {}

  async getApps() {
    return await this.repository.getApps();
  }

  async registerApp(app: registerAppInput["body"]) {
    return await this.repository.registerApp(app);
  }

  generateApiKey() {
    return "tb-" + v4();
  }

  async getApp(filter: { appId?: string; name?: string }) {
    return await this.repository.getApp(filter);
  }
}
