import express from 'express';
import { FighterController } from './fighter.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { FighterValidation } from './fighter.validation.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(FighterValidation.createFighterZodSchema),
  FighterController.createFighter
);

router.get('/', FighterController.getAllFighter);
router.get('/:id', FighterController.getFighterById);

router.patch(
  '/:id',
  validateRequest(FighterValidation.updateFighterZodSchema),
  FighterController.updateFighter
);

router.delete('/:id', FighterController.deleteFighter);

export const FighterRouter = router;
