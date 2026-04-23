import { z } from 'zod';

const createTeamZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }),
});

const updateTeamZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }).deepPartial(),
});

export const TeamValidation = {
  createTeamZodSchema,
  updateTeamZodSchema,
};
