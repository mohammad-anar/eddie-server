import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { CoachController } from "./coach.controller.js";
import { CoachValidation } from "./coach.validation.js";

const router = express.Router();

router.get(
  "/",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  CoachController.getAllCoaches
);

router.get(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  CoachController.getSingleCoach
);

router.post(
  "/",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  validateRequest(CoachValidation.createCoachZodSchema),
  CoachController.createCoach
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY, UserRole.COACH),
  validateRequest(CoachValidation.updateCoachZodSchema),
  CoachController.updateCoach
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB),
  CoachController.deleteCoach
);

export const CoachRoutes = router;
