import { z } from "zod";
import { UserRole } from "@prisma/client";

const loginZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const adminLoginZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const forgetPasswordZodSchema = z.object({
  email: z.string().email(),
});

const resetPasswordZodSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  newPassword: z.string().min(6),
});

const changePasswordZodSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

const refreshTokenZodSchema = z.object({
  refreshToken: z.string(),
});

const createUserZodSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
  userRole: z.nativeEnum(UserRole),
});

const createClubZodSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
});

const createAcademyZodSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
});

const createPlayerZodSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
});

const createAgentZodSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
});

const createCoachZodSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
});

export const AuthValidation = {
  loginZodSchema,
  adminLoginZodSchema,
  forgetPasswordZodSchema,
  resetPasswordZodSchema,
  changePasswordZodSchema,
  refreshTokenZodSchema,
  createClubZodSchema,
  createAcademyZodSchema,
  createPlayerZodSchema,
  createAgentZodSchema,
  createCoachZodSchema,
};
