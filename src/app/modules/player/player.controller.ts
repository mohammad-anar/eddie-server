import { Request, Response } from "express";
import httpStatus from "http-status";
import { PlayerService } from "./player.service.js";
import pick from "../../../helpers/pick.js";
import { playerFilterableFields, paginationFields } from "./player.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";
import { getSingleFilePath } from "../../shared/getFilePath.js";

const createPlayer = catchAsync(async (req: Request, res: Response) => {
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.styleImage = getSingleFilePath(req.files, "image");
  }
  const result = await PlayerService.createPlayer(req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Player created successfully",
    data: result,
  });
});

const getAllPlayers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, playerFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await PlayerService.getAllPlayers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Players retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePlayer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PlayerService.getSinglePlayer(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Player retrieved successfully",
    data: result,
  });
});

const updatePlayer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.styleImage = getSingleFilePath(req.files, "image");
  }
  const result = await PlayerService.updatePlayer(id as string, req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Player updated successfully",
    data: result,
  });
});

const deletePlayer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PlayerService.deletePlayer(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Player deleted successfully",
    data: result,
  });
});

export const PlayerController = {
  createPlayer,
  getAllPlayers,
  getSinglePlayer,
  updatePlayer,
  deletePlayer,
};
