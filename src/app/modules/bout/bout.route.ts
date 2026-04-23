import express from 'express';
import { BoutController } from './bout.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { BoutValidation } from './bout.validation.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(BoutValidation.createBoutZodSchema),
  BoutController.createBout
);

router.get('/', BoutController.getAllBout);
router.get('/:id', BoutController.getBoutById);

router.patch(
  '/:id',
  validateRequest(BoutValidation.updateBoutZodSchema),
  BoutController.updateBout
);

router.delete('/:id', BoutController.deleteBout);

export const BoutRouter = router;
