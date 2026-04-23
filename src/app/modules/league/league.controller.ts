import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { LeagueService } from './league.service.js';

const createLeague = catchAsync(async (req: Request, res: Response) => {
  const result = await LeagueService.createLeague(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'League created successfully',
    data: result,
  });
});

const getAllLeague = catchAsync(async (req: Request, res: Response) => {
  const result = await LeagueService.getAllLeague();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Leagues retrieved successfully',
    data: result,
  });
});

const getLeagueById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LeagueService.getLeagueById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'League retrieved successfully',
    data: result,
  });
});

const updateLeague = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LeagueService.updateLeague(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'League updated successfully',
    data: result,
  });
});

const deleteLeague = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LeagueService.deleteLeague(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'League deleted successfully',
    data: result,
  });
});

export const LeagueController = {
  createLeague,
  getAllLeague,
  getLeagueById,
  updateLeague,
  deleteLeague,
};
