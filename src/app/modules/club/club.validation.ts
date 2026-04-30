import { z } from "zod";

const createClubZodSchema = z.object({
  name: z.string("Name is required"),
  country: z.string().optional(),
  countryFlag: z.string().optional(),
  city: z.string().optional(),
  coverPhoto: z.string().optional(),
  logo: z.string().optional(),
  dateOfEstablishment: z.string().optional(),
  secondaryEmail: z.email("Invalid email address").optional(),
  secondaryPhone: z.string().optional(),
  website: z.url("Invalid URL").optional(),
  description: z.string().optional(),
  visionAndMission: z.string().optional(),
  leagueId: z.string().optional(),
});

const updateClubZodSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  countryFlag: z.string().optional(),
  city: z.string().optional(),
  coverPhoto: z.string().optional(),
  logo: z.string().optional(),
  dateOfEstablishment: z.string().optional(),
  secondaryEmail: z.string().email().optional(),
  secondaryPhone: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  visionAndMission: z.string().optional(),
  leagueId: z.string().optional(),
});

export const ClubValidation = {
  createClubZodSchema,
  updateClubZodSchema,
};
