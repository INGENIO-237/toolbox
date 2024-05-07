import { object, string, z } from "zod";

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    SendSms:
 *      required:
 *        - recipient
 *        - message
 *      properties:
 *        recipient:
 *          type: string
 *        message:
 *          type: string
 */
export const sendSmsSchema = object({
  body: object({
    recipient: string({ required_error: "Recipient phone number is required" }),
    message: string({
      required_error: "The message to be sent is required",
    }).min(3, "Message too short"),
  })
});

export type SendSMSInput = z.infer<typeof sendSmsSchema>;
