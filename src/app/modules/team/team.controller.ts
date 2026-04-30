import { Request, Response } from "express";
import httpStatus from "http-status";
import { TeamService } from "./team.service.js";
import pick from "../../../helpers/pick.js";
import { teamFilterableFields, paginationFields } from "./team.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

const createTeam = catchAsync(async (req: Request, res: Response) => {
  if (req.body.data) {
    req.body.data = JSON.parse(req.body.data);
  }
  const result = await TeamService.createTeam(req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Team created successfully",
    data: result,
  });
});

const getAllTeams = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, teamFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await TeamService.getAllTeams(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Teams retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TeamService.getSingleTeam(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Team retrieved successfully",
    data: result,
  });
});

const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.body.data) {
    req.body.data = JSON.parse(req.body.data);
  }
  const result = await TeamService.updateTeam(id as string, req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Team updated successfully",
    data: result,
  });
});

const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TeamService.deleteTeam(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Team deleted successfully",
    data: result,
  });
});

export const TeamController = {
  createTeam,
  getAllTeams,
  getSingleTeam,
  updateTeam,
  deleteTeam,
};
