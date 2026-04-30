import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { AcademyController } from "./academy.controller.js";
import { AcademyValidation } from "./academy.validation.js";

const router = express.Router();

router.get("/", auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY), AcademyController.getAllAcademies);
router.get("/:id", auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY), AcademyController.getSingleAcademy);

router.post(
  "/",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB),
  validateRequest(AcademyValidation.createAcademyZodSchema),
  AcademyController.createAcademy
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  validateRequest(AcademyValidation.updateAcademyZodSchema),
  AcademyController.updateAcademy
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB),
  AcademyController.deleteAcademy
);

export const AcademyRoutes = router;
