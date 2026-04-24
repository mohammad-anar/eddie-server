import express from "express";
import { BoutController } from "./bout.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { BoutValidation } from "./bout.validation.js";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../types/enum.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bouts
 *   description: Bout management and result posting with automatic scoring
 */

/**
 * @swagger
 * /bout/event/{eventId}:
 *   get:
 *     tags: [Bouts]
 *     summary: Get all bouts for an event ordered by card position
 *     security: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of bouts with fighters
 */
router.get("/event/:eventId", BoutController.getBoutsByEventId);

/**
 * @swagger
 * /bout/{id}:
 *   get:
 *     tags: [Bouts]
 *     summary: Get bout by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Bout details
 *       404:
 *         description: Bout not found
 *   delete:
 *     tags: [Bouts]
 *     summary: Delete bout (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Bout deleted
 */
router.get("/:id", BoutController.getBoutById);

/**
 * @swagger
 * /bout:
 *   post:
 *     tags: [Bouts]
 *     summary: Create a bout with two fighters (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoutBody'
 *     responses:
 *       201:
 *         description: Bout created with fighters assigned
 */
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(BoutValidation.createBoutZodSchema),
  BoutController.createBout
);

/**
 * @swagger
 * /bout/{id}/result:
 *   patch:
 *     tags: [Bouts]
 *     summary: Post bout result and trigger fantasy scoring (Admin only)
 *     description: Posts the winner and result type. Automatically calculates and saves TeamBoutScore for all teams that own the winning fighter.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoutResultBody'
 *     responses:
 *       200:
 *         description: Result posted and scores calculated
 *       400:
 *         description: Result already posted or invalid winner
 */
router.patch(
  "/:id/result",
  auth(Role.ADMIN),
  validateRequest(BoutValidation.postBoutResultZodSchema),
  BoutController.postBoutResult
);

router.delete("/:id", auth(Role.ADMIN), BoutController.deleteBout);

export const BoutRouter = router;
