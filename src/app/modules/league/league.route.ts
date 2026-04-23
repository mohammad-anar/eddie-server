import express from 'express';
import { LeagueController } from './league.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { LeagueValidation } from './league.validation.js';

const router = express.Router();

router.post(
  '/',
  validateRequest(LeagueValidation.createLeagueZodSchema),
  LeagueController.createLeague
);

router.get('/', LeagueController.getAllLeague);
router.get('/:id', LeagueController.getLeagueById);

router.patch(
  '/:id',
  validateRequest(LeagueValidation.updateLeagueZodSchema),
  LeagueController.updateLeague
);

router.delete('/:id', LeagueController.deleteLeague);

export const LeagueRouter = router;
