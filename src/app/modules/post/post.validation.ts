import { z } from "zod";

const createPostZodSchema = z.object({
  
  content: z.string().optional(),
  type: z.string().optional(),
  playerId: z.string().optional(),
  academyId: z.string().optional(),
  clubId: z.string().optional(),
  coachId: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  article: z.object({
    title: z.string({ message: "Article title is required" }),
    body: z.string().optional(),
    summary: z.string().optional(),
    academyId: z.string().optional(),
  }).optional(),
});

const updatePostZodSchema = z.object({
  content: z.string().optional(),
  type: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  article: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    summary: z.string().optional(),
  }).optional(),
});

const createCommentZodSchema = z.object({
  postId: z.string({ message: "Post ID is required" }),
  content: z.string({ message: "Content is required" }),
  parentId: z.string().optional(),
});

export const PostValidation = {
  createPostZodSchema,
  updatePostZodSchema,
  createCommentZodSchema,
};
