import { Service } from "typedi";
import { registerAppInput } from "../schemas/apps.schemas";
import App from "../models/apps.model";

@Service()
export default class AppsRepository {
  async getApps() {
    return await App.find().select("-__v");
  }

  async registerApp(app: registerAppInput["body"]) {
    return await App.create(app);
  }

  async getApp({ appId, name }: { appId?: string; name?: string }) {
    return await App.find({ $or: [{ _id: appId }, { name }] });
  }
}
