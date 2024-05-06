import { number, object, optional, string, z } from "zod";

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

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
  }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

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