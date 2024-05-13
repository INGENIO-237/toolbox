import "reflect-metadata";

import { Document, Schema, model } from "mongoose";
import { ACCOUNT_MODE, ALLOWED_SERVICES } from "../utils/enums/common";
import Container from "typedi";
import AppsService from "../services/apps.services";

type Solde = {
  card: number;
  mobile: number;
}

export interface AppDocument extends Document {
  name: string;
  allowedServices: ALLOWED_SERVICES;
  apiKey: string;
  mode: ACCOUNT_MODE;
  solde: Solde;
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
      enum: ALLOWED_SERVICES,
      default: ALLOWED_SERVICES.both,
    },
    apiKey: String,
    mode: {
      type: String,
      enum: ACCOUNT_MODE,
      default: ACCOUNT_MODE.test,
    },
    solde: {
      type: {
        card: {
          type: Number,
          default: 0,
        },
        mobile: {
          type: Number,
          default: 0,
        },
      },
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
