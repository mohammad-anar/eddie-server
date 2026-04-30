import { Request, Response } from "express";
import httpStatus from "http-status";
import { ParentService } from "./parent.service.js";
import pick from "../../../helpers/pick.js";
import { parentFilterableFields, paginationFields } from "./parent.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

const createParent = catchAsync(async (req: Request, res: Response) => {
  const result = await ParentService.createParent(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parent created successfully",
    data: result,
  });
});

const getAllParents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, parentFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await ParentService.getAllParents(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parents retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleParent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ParentService.getSingleParent(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parent retrieved successfully",
    data: result,
  });
});

const updateParent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ParentService.updateParent(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parent updated successfully",
    data: result,
  });
});

const deleteParent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ParentService.deleteParent(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parent deleted successfully",
    data: result,
  });
});

export const ParentController = {
  createParent,
  getAllParents,
  getSingleParent,
  updateParent,
  deleteParent,
};
