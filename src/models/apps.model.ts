import "reflect-metadata";

import { Document, Schema, model } from "mongoose";
import { AccountMode, AllowedServices } from "../types/enums";
import Container from "typedi";
import AppsService from "../services/apps.services";

export interface AppDocument extends Document {
  name: string;
  allowedServices: AllowedServices;
  apiKey: string;
  mode: AccountMode;
  solde: number;
  hasBeenDeleted: boolean;
  createdAt: Date;
}

const appSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    allowedServices: {
      type: String,
      enum: AllowedServices,
      default: AllowedServices.both,
    },
    apiKey: String,
    mode: {
      type: String,
      enum: AccountMode,
      default: AccountMode.test,
    },
    solde: {
      type: Number,
      default: 0,
    },
    hasBeenDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

appSchema.pre<AppDocument>("save", async function (next) {
  let doc = this;

  const appService = Container.get(AppsService);

  if (doc.isNew) {
    doc.apiKey = appService.generateApiKey();
  }

  next();
});

const App = model<AppDocument>("App", appSchema);

export default App;
