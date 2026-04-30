import { z } from "zod";

const createMatchZodSchema = z.object({
  title: z.string().optional(),
  academyId: z.string().optional(),
  clubId: z.string().optional(),
  leagueId: z.string().optional(),
  homeTeamId: z.string({
    message: "Home team ID is required",
  }),
  awayTeamId: z.string({
    message: "Away team ID is required",
  }),
  matchType: z.string({
    message: "Match type is required",
  }),
  status: z.string().optional(),
  kickoffAt: z.string({
    message: "Kickoff time is required",
  }),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  videoLink: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  matchHighlights: z.array(z.string()).optional(),
  referees: z.string().optional(),
  additionalNotes: z.string().optional(),
});

const updateMatchZodSchema = z.object({
  title: z.string().optional(),
  academyId: z.string().optional(),
  clubId: z.string().optional(),
  leagueId: z.string().optional(),
  homeTeamId: z.string().optional(),
  awayTeamId: z.string().optional(),
  matchType: z.string().optional(),
  status: z.string().optional(),
  kickoffAt: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  videoLink: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  matchHighlights: z.array(z.string()).optional(),
  referees: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export const MatchValidation = {
  createMatchZodSchema,
  updateMatchZodSchema,
};
