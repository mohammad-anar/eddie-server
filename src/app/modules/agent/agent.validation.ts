import { z } from "zod";

const createAgentZodSchema = z.object({
  userId: z.string({
    message: "User ID is required",
  }),
  agencyName: z.string().optional(),
  licenseNumber: z.string().optional(),
  experienceYears: z.number().optional(),
  specialization: z.string().optional(),
  verificationStatus: z.string().optional(),
  commissionRate: z.number().optional(),
  clubId: z.string().optional(),
});

const updateAgentZodSchema = z.object({
  agencyName: z.string().optional(),
  licenseNumber: z.string().optional(),
  experienceYears: z.number().optional(),
  specialization: z.string().optional(),
  verificationStatus: z.string().optional(),
  commissionRate: z.number().optional(),
  clubId: z.string().optional(),
});

export const AgentValidation = {
  createAgentZodSchema,
  updateAgentZodSchema,
};
