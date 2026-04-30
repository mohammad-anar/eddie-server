import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { AgentController } from "./agent.controller.js";
import { AgentValidation } from "./agent.validation.js";

const router = express.Router();

router.get("/", auth(AdminRole.SUPER_ADMIN), AgentController.getAllAgents);

router.get("/my-earnings", auth(UserRole.AGENT), AgentController.getMyEarnings);

router.get("/:id", auth(AdminRole.SUPER_ADMIN, UserRole.AGENT, UserRole.PLAYER), AgentController.getSingleAgent);

router.post(
  "/",
  auth(AdminRole.SUPER_ADMIN),
  validateRequest(AgentValidation.createAgentZodSchema),
  AgentController.createAgent
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.AGENT),
  validateRequest(AgentValidation.updateAgentZodSchema),
  AgentController.updateAgent
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN),
  AgentController.deleteAgent
);

export const AgentRoutes = router;
