import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { PlayerController } from "./player.controller.js";
import { PlayerValidation } from "./player.validation.js";
import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

router.get(
  "/",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY),
  PlayerController.getAllPlayers
);

router.get(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY, UserRole.PLAYER),
  PlayerController.getSinglePlayer
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
  validateRequest(PlayerValidation.createPlayerZodSchema),
  PlayerController.createPlayer
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB, UserRole.ACADEMY, UserRole.PLAYER),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(PlayerValidation.updatePlayerZodSchema),
  PlayerController.updatePlayer
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PROFESSIONAL_CLUB),
  PlayerController.deletePlayer
);

export const PlayerRoutes = router;
