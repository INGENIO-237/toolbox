import { nativeEnum, number, object, optional, z } from "zod";
import { SUPPORTED_CURRENCIES } from "../../utils/enums/payment";

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    InitializePayment:
 *      required:
 *        - amount
 *      properties:
 *        amount:
 *          type: integer
 *        currency:
 *          type: string
 */
export const createPaymentSchema = object({
  body: object({
    amount: number({
      required_error: "Amount to be paid is required",
      invalid_type_error: "Amount to be paid must be of type number",
    }),
    currency: optional(
      nativeEnum(SUPPORTED_CURRENCIES, {
        invalid_type_error: "Currency not valid or not supported",
      })
    ),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
