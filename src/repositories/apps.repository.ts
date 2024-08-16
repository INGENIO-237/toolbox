import { Service } from "typedi";
import { RegisterAppInput, UpdateAppInput } from "../schemas/apps.schemas";
import App, { AppDocument } from "../models/apps.model";
import { Types } from "mongoose";
import { BALANCE_TYPE, TRANSACTION_TYPE } from "../utils/enums/payment";

@Service()
export default class AppsRepository {
  async getApps() {
    return await App.find().select("-__v");
  }

  async registerApp(app: RegisterAppInput["body"]) {
    return await App.create(app);
  }

  async getApp({
    appId,
    name,
    apiKey,
  }: {
    appId?: string;
    name?: string;
    apiKey?: string;
  }) {
    return await App.findOne({
      $or: [{ _id: new Types.ObjectId(appId) }, { name }, { apiKey }],
    });
  }

  async updateApp(appId: string, update: UpdateAppInput["body"]) {
    await App.findByIdAndUpdate(appId, update);
  }

  async updateAppBalance(
    appId: string,
    amount: number,
    balanceType: BALANCE_TYPE,
    trxType: TRANSACTION_TYPE
  ) {
    const app = (await App.findById(appId)) as AppDocument;

    if (!app.balance) {
      app.balance = {
        mobile: 0,
        card: 0,
      };
    }

    if (trxType == TRANSACTION_TYPE.CASHIN) {
      balanceType === BALANCE_TYPE.CARD
        ? (app.balance.card += amount)
        : (app.balance.mobile += amount);
    }

    if (trxType == TRANSACTION_TYPE.CASHOUT) {
      balanceType === BALANCE_TYPE.CARD
        ? (app.balance.card -= amount)
        : (app.balance.mobile -= amount);
    }

    await app.save();
  }
}
