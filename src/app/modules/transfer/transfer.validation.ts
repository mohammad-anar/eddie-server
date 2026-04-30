import { z } from "zod";

const createTransferZodSchema = z.object({
  playerId: z.string({
    message: "Player ID is required",
  }),
  agentId: z.string().optional(),
  sourceClubId: z.string().optional(),
  sourceAcademyId: z.string().optional(),
  destClubId: z.string().optional(),
  destAcademyId: z.string().optional(),
  transferFee: z.number().optional(),
  commissionAmount: z.number().optional(),
  status: z.string().optional(),
  category: z.string({
    message: "Category is required",
  }),
  academyTransferType: z.string().optional(),
  initiatorType: z.string({
    message: "Initiator type is required",
  }),
  negotiationTerms: z.string().optional(),
  agreementDate: z.string().optional(),
  completionDate: z.string().optional(),
});

const updateTransferZodSchema = z.object({
  playerId: z.string().optional(),
  agentId: z.string().optional(),
  sourceClubId: z.string().optional(),
  sourceAcademyId: z.string().optional(),
  destClubId: z.string().optional(),
  destAcademyId: z.string().optional(),
  transferFee: z.number().optional(),
  commissionAmount: z.number().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  academyTransferType: z.string().optional(),
  initiatorType: z.string().optional(),
  negotiationTerms: z.string().optional(),
  agreementDate: z.string().optional(),
  completionDate: z.string().optional(),
});

export const TransferValidation = {
  createTransferZodSchema,
  updateTransferZodSchema,
};
