import { UserRole, AdminRole } from "@prisma/client";

export type ILogin = {
  email: string;
  password: string;
};

export type IAdminLogin = {
  email: string;
  password: string;
};

export type IForgetPassword = {
  email: string;
};

export type IResetPassword = {
  email: string;
  token: string;
  newPassword: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type IRefreshToken = {
  refreshToken: string;
};

export type ICreateClub = {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  [key: string]: any;
};

export type ICreateAcademy = {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  [key: string]: any;
};

export type ICreatePlayer = {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  dob?: string | Date;
  age?: number | string;
  [key: string]: any;
};

export type ICreateAgent = {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  [key: string]: any;
};

export type ICreateCoach = {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  [key: string]: any;
};

export type IJWTPayload = {
  id: string;
  role: UserRole | AdminRole;
  email: string;
};
