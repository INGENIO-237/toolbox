import { nativeEnum, number, object, z } from "zod";
import { SUPPORTED_CURRENCIES } from "../../utils/enums/payment";

export const createPaymentSchema = object({
  body: object({
    amount: number({
      required_error: "Amount to be paid is required",
      invalid_type_error: "Amount to be paid must be of type number",
    }),
    currency: nativeEnum(SUPPORTED_CURRENCIES, {
      required_error: "Currency is required",
      invalid_type_error: "Currency not valid or not supported",
    }),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
