import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { ParentController } from "./parent.controller.js";
import { ParentValidation } from "./parent.validation.js";
import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

router.get(
  "/",
  auth(AdminRole.SUPER_ADMIN, UserRole.PARENT),
  ParentController.getAllParents
);

router.get(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PARENT),
  ParentController.getSingleParent
);

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
  validateRequest(ParentValidation.createParentZodSchema),
  ParentController.createParent
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PARENT),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ParentValidation.updateParentZodSchema),
  ParentController.updateParent
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN),
  ParentController.deleteParent
);

export const ParentRoutes = router;
