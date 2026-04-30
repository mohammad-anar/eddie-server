import { Request, Response } from "express";
import httpStatus from "http-status";
import { ClubService } from "./club.service.js";
import pick from "../../../helpers/pick.js";
import { clubFilterableFields, paginationFields } from "./club.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

const createClub = catchAsync(async (req: Request, res: Response) => {
  const result = await ClubService.createClub(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Club created successfully",
    data: result,
  });
});

const getAllClubs = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, clubFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await ClubService.getAllClubs(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Clubs retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleClub = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClubService.getSingleClub(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Club retrieved successfully",
    data: result,
  });
});

const updateClub = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClubService.updateClub(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Club updated successfully",
    data: result,
  });
});

const deleteClub = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ClubService.deleteClub(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Club deleted successfully",
    data: result,
  });
});

export const ClubController = {
  createClub,
  getAllClubs,
  getSingleClub,
  updateClub,
  deleteClub,
};
