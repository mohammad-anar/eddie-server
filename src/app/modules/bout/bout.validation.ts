import { z } from 'zod';

const createBoutZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }),
});

const updateBoutZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }).deepPartial(),
});

export const BoutValidation = {
  createBoutZodSchema,
  updateBoutZodSchema,
};
