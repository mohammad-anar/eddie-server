import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { SponsorController } from "./sponsor.controller.js";
import { SponsorValidation } from "./sponsor.validation.js";
import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

router.get(
  "/",
  auth(AdminRole.SUPER_ADMIN, UserRole.ACADEMY),
  SponsorController.getAllSponsors
);

router.get(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.ACADEMY),
  SponsorController.getSingleSponsor
);

router.post(
  "/",
  auth(AdminRole.SUPER_ADMIN, UserRole.ACADEMY),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(SponsorValidation.createSponsorZodSchema),
  SponsorController.createSponsor
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.ACADEMY),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(SponsorValidation.updateSponsorZodSchema),
  SponsorController.updateSponsor
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.ACADEMY),
  SponsorController.deleteSponsor
);

export const SponsorRoutes = router;
