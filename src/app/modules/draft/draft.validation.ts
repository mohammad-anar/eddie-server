import { z } from 'zod';

const createDraftZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }),
});

const updateDraftZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }).deepPartial(),
});

export const DraftValidation = {
  createDraftZodSchema,
  updateDraftZodSchema,
};
