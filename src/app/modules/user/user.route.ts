import express from "express";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { UserController } from "./user.controller.js";

const router = express.Router();

router.get(
  "/get-me",
  auth(
    AdminRole.SUPER_ADMIN,
    UserRole.PROFESSIONAL_CLUB,
    UserRole.ACADEMY,
    UserRole.ACADEMY_MANAGER,
    UserRole.TEAM,
    UserRole.COACH,
    UserRole.PARENT,
    UserRole.PLAYER,
    UserRole.AGENT,
    UserRole.TEAM_MANAGER,
    UserRole.USER
  ),
  UserController.getMe
);

router.get(
  "/",
  auth(AdminRole.SUPER_ADMIN),
  UserController.getAllUsers
);

export const UserRoutes = router;
