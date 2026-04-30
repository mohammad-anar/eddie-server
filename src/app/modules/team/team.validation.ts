import { z } from "zod";

const createTeamZodSchema = z.object({
  name: z.string({
   message:"Name is required",
  }),
  clubId: z.string().optional(),
  academyId: z.string().optional(),
});

const updateTeamZodSchema = z.object({
  name: z.string().optional(),
  clubId: z.string().optional(),
  academyId: z.string().optional(),
});

export const TeamValidation = {
  createTeamZodSchema,
  updateTeamZodSchema,
};
