import { Service } from "typedi";
import AppsRepository from "../repositories/apps.repository";
import { RegisterAppInput, UpdateAppInput } from "../schemas/apps.schemas";
import { v4 } from "uuid";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../utils/constants/http.responses";

@Service()
export default class AppsService {
  constructor(private repository: AppsRepository) {}

  async getApps() {
    return await this.repository.getApps();
  }

  async registerApp(app: RegisterAppInput["body"]) {
    return await this.repository.registerApp(app);
  }

  generateApiKey() {
    return "tb-" + v4();
  }

  async getApp(filter: { appId?: string; name?: string; apiKey?: string }) {
    return await this.repository.getApp(filter);
  }

  async updateApp(appId: string, update: UpdateAppInput["body"]) {
    const app = await this.getApp({ appId });

    if (!app) {
      throw new ApiError("Unregistered app", HTTP.BAD_REQUEST);
    }

    await this.repository.updateApp(appId, update);
  }
}
