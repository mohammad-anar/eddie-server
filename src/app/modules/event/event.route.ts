import express from 'express';
import { EventController } from './event.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { EventValidation } from './event.validation.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(EventValidation.createEventZodSchema),
  EventController.createEvent
);

router.get('/', EventController.getAllEvent);
router.get('/:id', EventController.getEventById);

router.patch(
  '/:id',
  validateRequest(EventValidation.updateEventZodSchema),
  EventController.updateEvent
);

router.delete('/:id', EventController.deleteEvent);

export const EventRouter = router;
