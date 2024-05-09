import { Document, Schema, model } from "mongoose";
import { COUNTRY_CODE } from "../utils/enums/enums";

type Method = {
  name: string;
  countries: COUNTRY_CODE[];
};

export interface PartnerDocument extends Document {
  name: string;
  baseUrl: string;
  methods: Method[];
}

const partnerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  methods: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        countries: {
          type: [String],
          enum: COUNTRY_CODE,
        },
      },
    ],
  },
});

const Partner = model<PartnerDocument>("Partner", partnerSchema);

export default Partner;
