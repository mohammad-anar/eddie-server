import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { ClubController } from "./club.controller.js";
import { ClubValidation } from "./club.validation.js";

import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

router.get("/", auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB), ClubController.getAllClubs);
router.get("/:id", auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY), ClubController.getSingleClub);

router.post(
  "/",
  auth(AdminRole.SUPER_ADMIN),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ClubValidation.createClubZodSchema),
  ClubController.createClub
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ClubValidation.updateClubZodSchema),
  ClubController.updateClub
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN),
  ClubController.deleteClub
);

export const ClubRoutes = router;
