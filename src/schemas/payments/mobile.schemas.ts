import { nativeEnum, object, string, z } from "zod";
import { createPaymentSchema } from "./payment.schemas";
import { COUNTRY_CODE } from "../../utils/enums/common";

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    InitializeMobilePayment:
 *      required:
 *        - amount
 *        - currency
 *        - provider
 *        - phone
 *      properties:
 *        amount:
 *          type: integer
 *        currency:
 *          type: string
 *        provider:
 *          type: object
 *          required:
 *            - name
 *            - country
 *          properties:
 *            name:
 *              type: string
 *            country:
 *              type: string
 *        phone:
 *          type: string
 */
export const createMobilePaymentSchema = object({
  body: createPaymentSchema.shape.body.extend({
    provider: object({
      name: string({
        required_error: "Provider name is required",
        invalid_type_error: "Provider must be of type string",
      }),
      country: nativeEnum(COUNTRY_CODE, {
        required_error: "Provider's country is required",
        invalid_type_error: "Provider's country not valid or not supported",
      }),
    }),
    phone: string({ required_error: "Phone number is required" }),
  }),
});

export type CreateMobilePaymentInput = z.infer<
  typeof createMobilePaymentSchema
>;
