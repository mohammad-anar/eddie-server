import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { TeamService } from './team.service.js';

const createTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.createTeam(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Team created successfully',
    data: result,
  });
});

const getAllTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.getAllTeam();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teams retrieved successfully',
    data: result,
  });
});

const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TeamService.getTeamById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team retrieved successfully',
    data: result,
  });
});

const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TeamService.updateTeam(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team updated successfully',
    data: result,
  });
});

const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TeamService.deleteTeam(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team deleted successfully',
    data: result,
  });
});

export const TeamController = {
  createTeam,
  getAllTeam,
  getTeamById,
  updateTeam,
  deleteTeam,
};
