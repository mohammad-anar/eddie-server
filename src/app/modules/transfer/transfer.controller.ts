import { Request, Response } from "express";
import httpStatus from "http-status";
import { TransferService } from "./transfer.service.js";
import pick from "../../../helpers/pick.js";
import { transferFilterableFields, paginationFields } from "./transfer.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

const createTransfer = catchAsync(async (req: Request, res: Response) => {
  if (req.body.data) {
    req.body.data = JSON.parse(req.body.data);
  }
  const result = await TransferService.createTransfer(req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transfer created successfully",
    data: result,
  });
});

const getAllTransfers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, transferFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await TransferService.getAllTransfers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transfers retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTransfer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransferService.getSingleTransfer(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transfer retrieved successfully",
    data: result,
  });
});

const updateTransfer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.body.data) {
    req.body.data = JSON.parse(req.body.data);
  }
  const result = await TransferService.updateTransfer(id as string, req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transfer updated successfully",
    data: result,
  });
});

const deleteTransfer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransferService.deleteTransfer(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transfer deleted successfully",
    data: result,
  });
});

export const TransferController = {
  createTransfer,
  getAllTransfers,
  getSingleTransfer,
  updateTransfer,
  deleteTransfer,
};
