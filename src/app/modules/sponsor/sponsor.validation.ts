import { z } from "zod";

const createSponsorZodSchema = z.object({
  companyName: z.string({
    message: "Company name is required",
  }),
  contactPersonName: z.string().optional(),
  contactPersonEmail: z.string().optional(),
  contactPersonPhone: z.string().optional(),
  contactPersonAddress: z.string().optional(),
  sponsorType: z.string().optional(),
  status: z.string().optional(),
  contractValue: z.number().optional(),
  paymentStatus: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  description: z.string().optional(),
  benefitsOrDeliverables: z.string().optional(),
  academyId: z.string().optional(),
});

const updateSponsorZodSchema = z.object({
  companyName: z.string().optional(),
  contactPersonName: z.string().optional(),
  contactPersonEmail: z.string().optional(),
  contactPersonPhone: z.string().optional(),
  contactPersonAddress: z.string().optional(),
  sponsorType: z.string().optional(),
  status: z.string().optional(),
  contractValue: z.number().optional(),
  paymentStatus: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  description: z.string().optional(),
  benefitsOrDeliverables: z.string().optional(),
  academyId: z.string().optional(),
});

export const SponsorValidation = {
  createSponsorZodSchema,
  updateSponsorZodSchema,
};
