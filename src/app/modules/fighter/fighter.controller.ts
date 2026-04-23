import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { FighterService } from './fighter.service.js';

const createFighter = catchAsync(async (req: Request, res: Response) => {
  const result = await FighterService.createFighter(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Fighter created successfully',
    data: result,
  });
});

const getAllFighter = catchAsync(async (req: Request, res: Response) => {
  const result = await FighterService.getAllFighter();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fighters retrieved successfully',
    data: result,
  });
});

const getFighterById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FighterService.getFighterById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fighter retrieved successfully',
    data: result,
  });
});

const updateFighter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FighterService.updateFighter(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fighter updated successfully',
    data: result,
  });
});

const deleteFighter = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FighterService.deleteFighter(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fighter deleted successfully',
    data: result,
  });
});

export const FighterController = {
  createFighter,
  getAllFighter,
  getFighterById,
  updateFighter,
  deleteFighter,
};
