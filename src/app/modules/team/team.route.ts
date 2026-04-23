import express from 'express';
import { TeamController } from './team.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { TeamValidation } from './team.validation.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(TeamValidation.createTeamZodSchema),
  TeamController.createTeam
);

router.get('/', TeamController.getAllTeam);
router.get('/:id', TeamController.getTeamById);

router.patch(
  '/:id',
  validateRequest(TeamValidation.updateTeamZodSchema),
  TeamController.updateTeam
);

router.delete('/:id', TeamController.deleteTeam);

export const TeamRouter = router;
