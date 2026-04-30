import { z } from "zod";

const createSubscriptionPlanZodSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  category: z.string().optional(),
  duration: z.string().optional(),
  status: z.string().optional(),
  price: z.number().optional(),
});

const updateSubscriptionPlanZodSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  duration: z.string().optional(),
  status: z.string().optional(),
  price: z.number().optional(),
});

export const SubscriptionPlanValidation = {
  createSubscriptionPlanZodSchema,
  updateSubscriptionPlanZodSchema,
};
