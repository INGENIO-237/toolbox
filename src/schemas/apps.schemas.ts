import { object, optional, string, z } from "zod";
import { ACCOUNT_MODE, ALLOWED_SERVICES } from "../utils/enums/enums";
import { Types } from "mongoose";

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    RegisterApp:
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 */
export const registerAppSchema = object({
  body: object({
    name: string({
      required_error: "App name is required",
      invalid_type_error: "App name must be a string",
    }),
  }),
});

export type RegisterAppInput = z.infer<typeof registerAppSchema>;

/**
 * @openapi
 * 
 * components:
 *   schemas:
 *    UpdateApp:
 *      properties:
 *        name:
 *          type: string
 *        allowedServices:
 *          type: string
 *        mode:
 *          type: string
 */
export const updateAppShema = object({
  params: object({
    appId: string({
      required_error: "App identifier is required as a parameter",
    }),
  }).superRefine((data, ctx) => {
    if (data.appId) {
      try {
        new Types.ObjectId(data.appId);
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid app identifier",
        });
      }
    }
  }),

  body: object({
    name: optional(
      string({
        invalid_type_error: "Name must be string",
      })
    ),
    allowedServices: optional(
      string({ invalid_type_error: "Allowed services must be of type string" })
    ),
    mode: optional(string({ invalid_type_error: "Mode must be a string" })),
  }).superRefine((data, ctx) => {
    if (!data.name && !data.allowedServices && !data.mode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid payload. Cannot process an empty payload.",
      });
    }

    if (data.allowedServices) {
      if (
        !Object.values(ALLOWED_SERVICES).includes(
          data.allowedServices as ALLOWED_SERVICES
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid Allowed Service",
        });
      }
    }

    if (data.mode) {
      if (!Object.values(ACCOUNT_MODE).includes(data.mode as ACCOUNT_MODE)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid Account Mode",
        });
      }
    }
  }),
});

export type UpdateAppInput = z.infer<typeof updateAppShema>;
