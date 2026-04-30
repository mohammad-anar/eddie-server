import { z } from "zod";

const createLeagueZodSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  country: z.string().optional(),
  countryFlag: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
});

const updateLeagueZodSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  countryFlag: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
});

export const LeagueValidation = {
  createLeagueZodSchema,
  updateLeagueZodSchema,
};
