import { z } from "zod";

const createAcademyZodSchema = z.object({
  name: z.string({
   message:"Name is required",
  }),
  logo: z.string().optional(),
  coverPhoto: z.string().optional(),
  nationality: z.string().optional(),
  nationalityFlag: z.string().optional(),
  dateOfEstablishment: z.string().optional(),
  city: z.string().optional(),
  secondaryEmail: z.string().email().optional(),
  secondaryPhone: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  visionAndMission: z.string().optional(),
  trainingPhilosophy: z.string().optional(),
  ageGroup: z.string().optional(),
});

const updateAcademyZodSchema = z.object({
  name: z.string().optional(),
  logo: z.string().optional(),
  coverPhoto: z.string().optional(),
  nationality: z.string().optional(),
  nationalityFlag: z.string().optional(),
  dateOfEstablishment: z.string().optional(),
  city: z.string().optional(),
  secondaryEmail: z.string().email().optional(),
  secondaryPhone: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  visionAndMission: z.string().optional(),
  trainingPhilosophy: z.string().optional(),
  ageGroup: z.string().optional(),
});

export const AcademyValidation = {
  createAcademyZodSchema,
  updateAcademyZodSchema,
};
