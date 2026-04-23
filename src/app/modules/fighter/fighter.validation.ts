import { z } from 'zod';

const createFighterZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }),
});

const updateFighterZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }).deepPartial(),
});

export const FighterValidation = {
  createFighterZodSchema,
  updateFighterZodSchema,
};
