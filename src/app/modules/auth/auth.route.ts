import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { UserRole, AdminRole } from "@prisma/client";
import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";
import fileUploadHandler from "../../middlewares/fileUploadHandler.js";


const router = express.Router();

router.post(
  "/login-admin",
  validateRequest(AuthValidation.adminLoginZodSchema),
  AuthController.loginAdmin
);

router.post(
  "/login-user",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordZodSchema),
  AuthController.forgetPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordZodSchema),
  AuthController.resetPassword
);

router.patch(
  "/change-password",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY, UserRole.PLAYER, UserRole.AGENT, UserRole.COACH),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
);

// Creation Routes

router.post(
  "/create-club",
  auth(AdminRole.SUPER_ADMIN),
  fileUploadHandler(),
  AuthController.createClub
);

router.post(
  "/create-academy",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB),
  fileUploadHandler(),
  AuthController.createAcademy
);

router.post(
  "/create-player",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  fileUploadHandler(),
  AuthController.createPlayer
);

router.post(
  "/create-agent",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB),
  fileUploadHandler(),
  AuthController.createAgent
);

router.post(
  "/create-coach",
  auth(UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  fileUploadHandler(),
  AuthController.createCoach
);

export const AuthRouter = router;
