import { object, optional, string, z } from "zod";

export const createUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password must be at least 6 chars long."
    ),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = object({
  params: object({
    user: string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    }),
  }),
  body: object({
    email: optional(string().email("Invalid email format")),
    password: optional(
      string().min(6, "Password must be at least 6 chars long.")
    ),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateUserProfileSchema = object({
  body: object({
    email: optional(string().email("Invalid email format")),
    password: optional(
      string().min(6, "Password must be at least 6 chars long.")
    ),
  }),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserSchema>;
