import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { BoutService } from './bout.service.js';

const createBout = catchAsync(async (req: Request, res: Response) => {
  const result = await BoutService.createBout(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Bout created successfully',
    data: result,
  });
});

const getAllBout = catchAsync(async (req: Request, res: Response) => {
  const result = await BoutService.getAllBout();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bouts retrieved successfully',
    data: result,
  });
});

const getBoutById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BoutService.getBoutById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bout retrieved successfully',
    data: result,
  });
});

const updateBout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BoutService.updateBout(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bout updated successfully',
    data: result,
  });
});

const deleteBout = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BoutService.deleteBout(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bout deleted successfully',
    data: result,
  });
});

export const BoutController = {
  createBout,
  getAllBout,
  getBoutById,
  updateBout,
  deleteBout,
};
