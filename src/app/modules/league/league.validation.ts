import { z } from 'zod';

const createLeagueZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }),
});

const updateLeagueZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }).deepPartial(),
});

export const LeagueValidation = {
  createLeagueZodSchema,
  updateLeagueZodSchema,
};
