import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { BoutService } from "./bout.service.js";

const createBout = catchAsync(async (req: Request, res: Response) => {
  const result = await BoutService.createBout(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "Bout created successfully", data: result });
});

const getBoutsByEventId = catchAsync(async (req: Request, res: Response) => {
  const result = await BoutService.getBoutsByEventId(req.params.eventId);
  sendResponse(res, { statusCode: 200, success: true, message: "Bouts retrieved successfully", data: result });
});

const getBoutById = catchAsync(async (req: Request, res: Response) => {
  const result = await BoutService.getBoutById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Bout retrieved successfully", data: result });
});

const postBoutResult = catchAsync(async (req: Request, res: Response) => {
  const result = await BoutService.postBoutResult(req.params.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Bout result posted and scores calculated", data: result });
});

const deleteBout = catchAsync(async (req: Request, res: Response) => {
  const result = await BoutService.deleteBout(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Bout deleted successfully", data: result });
});

export const BoutController = { createBout, getBoutsByEventId, getBoutById, postBoutResult, deleteBout };
