import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import pick from "../../../helpers/pick.js";
import { LeagueService } from "./league.service.js";

const createLeague = catchAsync(async (req: Request, res: Response) => {
  const result = await LeagueService.createLeague(req.user.id, req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "League created successfully", data: result });
});

const getAllLeagues = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "status", "leagueType"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await LeagueService.getAllLeagues(filters as any, options as any);
  sendResponse(res, { statusCode: 200, success: true, message: "Leagues retrieved successfully", data: result });
});

const getMyLeagues = catchAsync(async (req: Request, res: Response) => {
  const result = await LeagueService.getMyLeagues(req.user.id);
  sendResponse(res, { statusCode: 200, success: true, message: "My leagues retrieved successfully", data: result });
});

const getLeagueById = catchAsync(async (req: Request, res: Response) => {
  const result = await LeagueService.getLeagueById(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "League retrieved successfully", data: result });
});

const joinLeague = catchAsync(async (req: Request, res: Response) => {
  const result = await LeagueService.joinLeague(req.user.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Successfully joined the league", data: result });
});

const joinQuickLeague = catchAsync(async (req: Request, res: Response) => {
  const { teamName } = req.body;
  const result = await LeagueService.joinQuickLeague(req.user.id, teamName || `Team ${req.user.id.slice(0, 5)}`);
  sendResponse(res, { statusCode: 200, success: true, message: "Successfully joined a quick league", data: result });
});

const updateLeague = catchAsync(async (req: Request, res: Response) => {
  const result = await LeagueService.updateLeague(req.params.id, req.user.id, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "League updated successfully", data: result });
});

const deleteLeague = catchAsync(async (req: Request, res: Response) => {
  const result = await LeagueService.deleteLeague(req.params.id, req.user.id, req.user.role);
  sendResponse(res, { statusCode: 200, success: true, message: "League deleted successfully", data: result });
});

export const LeagueController = {
  createLeague, getAllLeagues, getMyLeagues, getLeagueById,
  joinLeague, joinQuickLeague, updateLeague, deleteLeague,
};
