import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole } from "@prisma/client";
import { SubscriptionPlanController } from "./subscriptionPlan.controller.js";
import { SubscriptionPlanValidation } from "./subscriptionPlan.validation.js";

const router = express.Router();

router.get("/", SubscriptionPlanController.getAllSubscriptionPlans);
router.get("/:id", SubscriptionPlanController.getSingleSubscriptionPlan);

router.post(
  "/",
  auth(AdminRole.SUPER_ADMIN),
  validateRequest(SubscriptionPlanValidation.createSubscriptionPlanZodSchema),
  SubscriptionPlanController.createSubscriptionPlan
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN),
  validateRequest(SubscriptionPlanValidation.updateSubscriptionPlanZodSchema),
  SubscriptionPlanController.updateSubscriptionPlan
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN),
  SubscriptionPlanController.deleteSubscriptionPlan
);

export const SubscriptionPlanRoutes = router;
