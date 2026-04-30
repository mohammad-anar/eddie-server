import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { LeagueController } from "./league.controller.js";
import { LeagueValidation } from "./league.validation.js";
import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

router.get("/", auth(UserRole.PLAYER, UserRole.PARENT, UserRole.COACH, UserRole.ACADEMY, UserRole.PROFESSIONAL_CLUB), LeagueController.getAllLeagues);
router.get("/:id", auth(UserRole.PLAYER, UserRole.PARENT, UserRole.COACH, UserRole.ACADEMY, UserRole.PROFESSIONAL_CLUB), LeagueController.getSingleLeague);

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
  validateRequest(LeagueValidation.createLeagueZodSchema),
  LeagueController.createLeague
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
  validateRequest(LeagueValidation.updateLeagueZodSchema),
  LeagueController.updateLeague
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN),
  LeagueController.deleteLeague
);

export const LeagueRoutes = router;
