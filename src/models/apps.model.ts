import { Document, Schema, model } from "mongoose";
import { AccountMode, AllowedServices } from "../types/enums";

export interface AppDocument extends Document {
  name: string;
  allowedServices: AllowedServices;
  apiKey?: string;
  mode: AccountMode;
  solde: number;
}

const appSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  allowedServices: {
    type: String,
    required: true,
    enum: AllowedServices,
  },
  apiKey: String,
  mode: {
    type: String,
    default: AccountMode.test,
    enum: AccountMode,
  },
  solde: {
    type: Number,
    default: 0,
  },
});

appSchema.post("save", function(doc, next) {
    if(doc.isNew){
        // TODO: Generate and set apiKey
    }
})

const App = model<AppDocument>("App", appSchema);

export default App;
