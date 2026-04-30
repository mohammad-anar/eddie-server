import { Request, Response } from "express";
import httpStatus from "http-status";
import { CoachService } from "./coach.service.js";
import pick from "../../../helpers/pick.js";
import { coachFilterableFields, paginationFields } from "./coach.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

const createCoach = catchAsync(async (req: Request, res: Response) => {
  const result = await CoachService.createCoach(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coach created successfully",
    data: result,
  });
});

const getAllCoaches = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, coachFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await CoachService.getAllCoaches(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coaches retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCoach = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CoachService.getSingleCoach(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coach retrieved successfully",
    data: result,
  });
});

const updateCoach = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CoachService.updateCoach(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coach updated successfully",
    data: result,
  });
});

const deleteCoach = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CoachService.deleteCoach(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coach deleted successfully",
    data: result,
  });
});

export const CoachController = {
  createCoach,
  getAllCoaches,
  getSingleCoach,
  updateCoach,
  deleteCoach,
};
