import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { TeamController } from "./team.controller.js";
import { TeamValidation } from "./team.validation.js";

import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

router.get("/", auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY), TeamController.getAllTeams);
router.get("/:id", auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY), TeamController.getSingleTeam);

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
  validateRequest(TeamValidation.createTeamZodSchema),
  TeamController.createTeam
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(TeamValidation.updateTeamZodSchema),
  TeamController.updateTeam
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  TeamController.deleteTeam
);

export const TeamRoutes = router;
