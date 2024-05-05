import { Document, Schema, model } from "mongoose";
import { CountryCode } from "../types/enums";

type Method = {
  name: string;
  countries: CountryCode[];
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
          enum: CountryCode,
        },
      },
    ],
  },
});

const Partner = model<PartnerDocument>("Partner", partnerSchema);

export default Partner;
