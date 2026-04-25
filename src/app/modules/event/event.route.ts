import express from "express";
import { EventController } from "./event.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { EventValidation } from "./event.validation.js";
import auth from "../../middlewares/auth.js";
import { Role } from "../../../types/enum.js";

import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: UFC event management
 */

/**
 * @swagger
 * /event:
 *   get:
 *     tags: [Events]
 *     summary: Get all events (paginated)
 *     security: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [UPCOMING, ONGOING, COMPLETED, CANCELLED] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated event list with bout counts
 *   post:
 *     tags: [Events]
 *     summary: Create an event (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [data]
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/EventBody'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Event poster image
 *     responses:
 *       201:
 *         description: Event created
 */
router.get("/", EventController.getAllEvents);

router.post(
  "/",
  auth(Role.ADMIN),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(EventValidation.createEventZodSchema),
  EventController.createEvent
);

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get event by ID with all bouts and fighters
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event details with bouts
 *       404:
 *         description: Event not found
 *   patch:
 *     tags: [Events]
 *     summary: Update event (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [data]
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/EventBody'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Updated event poster image
 *     responses:
 *       200:
 *         description: Event updated
 *   delete:
 *     tags: [Events]
 *     summary: Delete event (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event deleted
 */
router.get("/:id", EventController.getEventById);

router.patch(
  "/:id",
  auth(Role.ADMIN),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(EventValidation.updateEventZodSchema),
  EventController.updateEvent
);

router.delete("/:id", auth(Role.ADMIN), EventController.deleteEvent);

/**
 * @swagger
 * /event/{id}/post-results:
 *   patch:
 *     tags: [Events]
 *     summary: Mark event as completed with results posted (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Event marked as completed
 */
router.patch("/:id/post-results", auth(Role.ADMIN), EventController.postResults);

export const EventRouter = router;
