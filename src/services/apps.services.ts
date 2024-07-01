import { Service } from "typedi";
import AppsRepository from "../repositories/apps.repository";
import { RegisterAppInput, UpdateAppInput } from "../schemas/apps.schemas";
import { v4 } from "uuid";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../utils/constants/http.responses";
import { AppDocument } from "../models/apps.model";
import COMMON_MSG from "../utils/constants/common.msgs";
import { BALANCE_TYPE, TRANSACTION_TYPE } from "../utils/enums/payment";

@Service()
export default class AppsService {
  constructor(private repository: AppsRepository) {}

  async getApps() {
    return await this.repository.getApps();
  }

  async registerApp(app: RegisterAppInput["body"]) {
    const nameIsUnique = await this.nameIsUnique({ name: app.name });

    if (!nameIsUnique) {
      throw new ApiError(COMMON_MSG.inUse("Name"), HTTP.BAD_REQUEST);
    }

    return await this.repository.registerApp(app);
  }

  generateApiKey() {
    return "tb-" + v4();
  }

  async getApp(filter: { appId?: string; name?: string; apiKey?: string }) {
    return await this.repository.getApp(filter) as AppDocument;
  }

  async updateApp(appId: string, update: UpdateAppInput["body"]) {
    const app = await this.getApp({ appId });

    if (update.name) {
      const nameIsUnique = await this.nameIsUnique({
        appId,
        name: update.name,
      });

      if (!nameIsUnique) {
        throw new ApiError(COMMON_MSG.inUse("Name"), HTTP.BAD_REQUEST);
      }
    }

    if (!app) {
      throw new ApiError(COMMON_MSG.unregistered("App"), HTTP.BAD_REQUEST);
    }

    await this.repository.updateApp(appId, update);
  }

  private async nameIsUnique({
    appId,
    name,
  }: {
    appId?: string;
    name: string;
  }) {
    const app = (await this.getApp({ name })) as AppDocument;

    if (!appId && app) return false;

    if (!app) return true;

    return app._id.toString() === appId;
  }

  async updateBalance(appId: string, amount: number, balanceType: BALANCE_TYPE, trxType?: TRANSACTION_TYPE){
    await this.repository.updateAppBalance(appId, amount, balanceType, trxType);
  }
}
