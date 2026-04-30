import { Request, Response } from "express";
import httpStatus from "http-status";
import { LeagueService } from "./league.service.js";
import pick from "../../../helpers/pick.js";
import { leagueFilterableFields, paginationFields } from "./league.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";
import { getSingleFilePath } from "../../shared/getFilePath.js";

const createLeague = catchAsync(async (req: Request, res: Response) => {
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.logo = getSingleFilePath(req.files, "logo");
    req.body.data.countryFlag = getSingleFilePath(req.files, "countryFlag");
  }
  const result = await LeagueService.createLeague(req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "League created successfully",
    data: result,
  });
});

const getAllLeagues = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, leagueFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await LeagueService.getAllLeagues(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leagues retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleLeague = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LeagueService.getSingleLeague(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "League retrieved successfully",
    data: result,
  });
});

const updateLeague = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.logo = getSingleFilePath(req.files, "logo");
  }
  const result = await LeagueService.updateLeague(id as string, req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "League updated successfully",
    data: result,
  });
});

const deleteLeague = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LeagueService.deleteLeague(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "League deleted successfully",
    data: result,
  });
});

export const LeagueController = {
  createLeague,
  getAllLeagues,
  getSingleLeague,
  updateLeague,
  deleteLeague,
};
