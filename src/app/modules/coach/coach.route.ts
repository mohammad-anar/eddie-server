import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { CoachController } from "./coach.controller.js";
import { CoachValidation } from "./coach.validation.js";

import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

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
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(CoachValidation.createCoachZodSchema),
  CoachController.createCoach
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY, UserRole.COACH),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(CoachValidation.updateCoachZodSchema),
  CoachController.updateCoach
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB),
  CoachController.deleteCoach
);

export const CoachRoutes = router;
