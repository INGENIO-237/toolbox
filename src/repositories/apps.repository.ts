import { Service } from "typedi";
import { RegisterAppInput, UpdateAppInput } from "../schemas/apps.schemas";
import App from "../models/apps.model";
import { Types } from "mongoose";

@Service()
export default class AppsRepository {
  async getApps() {
    return await App.find().select("-__v");
  }

  async registerApp(app: RegisterAppInput["body"]) {
    return await App.create(app);
  }

  async getApp({ appId, name }: { appId?: string; name?: string }) {
    return await App.findOne({
      $or: [{ _id: new Types.ObjectId(appId) }, { name }],
    });
  }

  async updateApp(appId: string, update: UpdateAppInput["body"]) {
    await App.findByIdAndUpdate(appId, update);
  }
}
