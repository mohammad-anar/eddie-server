import { Request, Response } from "express";
import httpStatus from "http-status";
import { MatchService } from "./match.service.js";
import pick from "../../../helpers/pick.js";
import { matchFilterableFields, paginationFields } from "./match.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";
import { getMultipleFilesPath } from "../../shared/getFilePath.js";

const createMatch = catchAsync(async (req: Request, res: Response) => {
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.galleryImages = getMultipleFilesPath(req.files, "galleryImages");
    req.body.data.matchHighlights = getMultipleFilesPath(req.files, "matchHighlights");
  }
  const result = await MatchService.createMatch(req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Match created successfully",
    data: result,
  });
});

const getAllMatches = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, matchFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await MatchService.getAllMatches(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Matches retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleMatch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MatchService.getSingleMatch(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Match retrieved successfully",
    data: result,
  });
});

const updateMatch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.galleryImages = getMultipleFilesPath(req.files, "galleryImages");
    req.body.data.matchHighlights = getMultipleFilesPath(req.files, "matchHighlights");
  }
  const result = await MatchService.updateMatch(id as string, req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Match updated successfully",
    data: result,
  });
});

const deleteMatch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MatchService.deleteMatch(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Match deleted successfully",
    data: result,
  });
});

export const MatchController = {
  createMatch,
  getAllMatches,
  getSingleMatch,
  updateMatch,
  deleteMatch,
};
