import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { DraftService } from './draft.service.js';

const createDraft = catchAsync(async (req: Request, res: Response) => {
  const result = await DraftService.createDraft(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Draft created successfully',
    data: result,
  });
});

const getAllDraft = catchAsync(async (req: Request, res: Response) => {
  const result = await DraftService.getAllDraft();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Drafts retrieved successfully',
    data: result,
  });
});

const getDraftById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DraftService.getDraftById(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Draft retrieved successfully',
    data: result,
  });
});

const updateDraft = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DraftService.updateDraft(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Draft updated successfully',
    data: result,
  });
});

const deleteDraft = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DraftService.deleteDraft(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Draft deleted successfully',
    data: result,
  });
});

export const DraftController = {
  createDraft,
  getAllDraft,
  getDraftById,
  updateDraft,
  deleteDraft,
};
