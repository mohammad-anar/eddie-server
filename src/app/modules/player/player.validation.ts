import { z } from "zod";

const createPlayerZodSchema = z.object({
  dob: z.string({
    message: "Date of birth is required",
  }),
  age: z.number({
    message: "Age is required",
  }),
  styleImage: z.string().optional(),
  playType: z.string().optional(),
  playerType: z.string().optional(),
  characteristics: z.string().optional(),
  academyId: z.string().optional(),
  clubId: z.string().optional(),
  agentId: z.string().optional(),
});

const updatePlayerZodSchema = z.object({
  dob: z.string().optional(),
  age: z.number().optional(),
  styleImage: z.string().optional(),
  playType: z.string().optional(),
  playerType: z.string().optional(),
  characteristics: z.string().optional(),
  academyId: z.string().optional(),
  clubId: z.string().optional(),
  agentId: z.string().optional(),
});

export const PlayerValidation = {
  createPlayerZodSchema,
  updatePlayerZodSchema,
};
