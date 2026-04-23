import { z } from 'zod';

const createEventZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }),
});

const updateEventZodSchema = z.object({
  body: z.object({
    // Add validation fields here
  }).deepPartial(),
});

export const EventValidation = {
  createEventZodSchema,
  updateEventZodSchema,
};
