import { z } from "zod";

const createParentZodSchema = z.object({
  addressId: z.string().optional(),
});

const updateParentZodSchema = z.object({
  addressId: z.string().optional(),
});

export const ParentValidation = {
  createParentZodSchema,
  updateParentZodSchema,
};
