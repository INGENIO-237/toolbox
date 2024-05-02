import { object, string, z } from "zod";
import isValidPhoneNumber from "../utils/phone";

export const sendSmsSchema = object({
  body: object({
    recipient: string({ required_error: "Recipient phone number is required" }),
    message: string({
      required_error: "The message to be sent is required",
    }).min(3, "Message too short"),
  }).superRefine((data, ctx) => {
    if (!isValidPhoneNumber(data.recipient)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number",
      });
    }
  }),
});

export type SendSMSInput = z.infer<typeof sendSmsSchema>;
