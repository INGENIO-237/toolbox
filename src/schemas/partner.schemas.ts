import { array, object, string, z } from "zod";
import { CountryCode } from "../types/enums";

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    RegisterPartner:
 *      required:
 *        - name
 *        - baseUrl
 *        - methods
 *      properties:
 *        name:
 *          type: string
 *        baseUrl:
 *          type: string
 *        methods:
 *          type: array
 *          items:
 *            type: object
 *            required:
 *              - name
 *              - countries
 *            properties:
 *              name:
 *                type: string
 *              countries:
 *                type: array
 *                items:
 *                  type: string
 *              
 */

export const createPartnerSchema = object({
  body: object({
    name: string({
      required_error: "Partner name is required",
      invalid_type_error: "Partner name must be a string",
    }),
    baseUrl: string({
      required_error: "Partner base url is required",
      invalid_type_error: "Partner base url must be a string",
    }),
    methods: array(
      object(
        {
          name: string({
            required_error: "Method name is required",
            invalid_type_error: "Method name must be of type string",
          }),
          countries: array(
            string({
              required_error: "Country of availability is required",
              invalid_type_error:
                "Country of availability must be of type string",
            })
              .min(2, "Country code must be at least 2 chars long")
              .max(2, "Country code can't exceed 2 chars long"),
            { required_error: "Countries of availability are required" }
          ).min(
            1,
            "Provide at least one country of availability for this method"
          ),
        },
        { invalid_type_error: "Invalid method type - Should be an object" }
      ),
      {
        required_error: "Available methods for this partner are required",
        invalid_type_error: "Invalid methods type - Should provide an array",
      }
    ).min(1, "Provide at least one payment method"),
  }).superRefine((data, ctx) => {
    data.methods.forEach((method) => {
      method.countries.forEach((country) => {
        if (!Object.values(CountryCode).includes(country as CountryCode)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Invalid country code - Should be 2 chars long, in uppercase.",
          });
        }
      });
    });
  }),
});

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
