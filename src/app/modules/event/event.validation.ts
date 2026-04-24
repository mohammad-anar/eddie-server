import { z } from "zod";

const createEventZodSchema = z.object({
  
    name: z.string({ message: "Event name is required" }),
    location: z.string({ message: "Location is required" }),
    date: z.string({ message: "Date is required" }),
    posterUrl: z.string().url().optional(),
    status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),

});

const updateEventZodSchema = z.object({
  
    name: z.string().optional(),
    location: z.string().optional(),
    date: z.string().optional(),
    posterUrl: z.string().url().nullable().optional(),
    status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),

});

export const EventValidation = {
  createEventZodSchema,
  updateEventZodSchema,
};
