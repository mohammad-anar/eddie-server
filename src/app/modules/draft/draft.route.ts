import express from 'express';
import { DraftController } from './draft.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { DraftValidation } from './draft.validation.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(DraftValidation.createDraftZodSchema),
  DraftController.createDraft
);

router.get('/', DraftController.getAllDraft);
router.get('/:id', DraftController.getDraftById);

router.patch(
  '/:id',
  validateRequest(DraftValidation.updateDraftZodSchema),
  DraftController.updateDraft
);

router.delete('/:id', DraftController.deleteDraft);

export const DraftRouter = router;
