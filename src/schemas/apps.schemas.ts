import { object, string, z } from "zod";

export const createAppSchema = object({
  name: string({
    required_error: "App name is required",
    invalid_type_error: "App name must be a string",
  }),
});

export type CreateAppInput = z.infer<typeof createAppSchema>;
