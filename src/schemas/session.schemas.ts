import { number, object, optional, string, z } from "zod";

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Login:
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        otp:
 *          type: integer
 *    LoginReturn:
 *      properties:
 *        accessToken:
 *          type: string
 *        refreshToken:
 *          type: string
 *        otpGenerated:
 *          type: boolean
 *          default: false
 */
export const createSessionSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
    password: string({ required_error: "Password is required" }),
    otp: optional(number({ invalid_type_error: "OTP must be a number" })),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

/**
 * @openapi
 * components:
 *  schemas:
 *    ForgotPassword:
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 */
export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
  }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * @openapi
 * 
 * components:
 *  schemas:
 *    ForgotPasswordConfirm:
 *      required:
 *        - email
 *        - password
 *        - otp
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        otp:
 *          type: integer
 */
export const forgotPasswordConfirmSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    }).email("Invalid email format"),
    otp: number({
      required_error: "OTP code is required",
      invalid_type_error: "OTP must be a number",
    }),
    password: string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    }),
  }),
});

export type ForgotPasswordConfirmInput = z.infer<
  typeof forgotPasswordConfirmSchema
>;

// export const resendOtpSchema = object({
//   body: object({
//     email: string({
//       required_error: "Email is required",
//       invalid_type_error: "Email must be a string",
//     }).email("Invalid email format"),
//   }),
// });

// export type ResendOtpInput = z.infer<typeof resendOtpSchema>
