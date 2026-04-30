import { Request, Response } from "express";
import httpStatus from "http-status";
import { AgentService } from "./agent.service.js";
import pick from "../../../helpers/pick.js";
import { agentFilterableFields, paginationFields } from "./agent.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

const createAgent = catchAsync(async (req: Request, res: Response) => {
  const result = await AgentService.createAgent(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent created successfully",
    data: result,
  });
});

const getAllAgents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, agentFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await AgentService.getAllAgents(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agents retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AgentService.getSingleAgent(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent retrieved successfully",
    data: result,
  });
});

const updateAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AgentService.updateAgent(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent updated successfully",
    data: result,
  });
});

const deleteAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AgentService.deleteAgent(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent deleted successfully",
    data: result,
  });
});

const getMyEarnings = catchAsync(async (req: Request, res: Response) => {
  const agentId = (req.user as any).id; // Assuming auth middleware provides agent/user ID
  const result = await AgentService.getMyEarnings(agentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Earnings retrieved successfully",
    data: result,
  });
});

export const AgentController = {
  createAgent,
  getAllAgents,
  getSingleAgent,
  updateAgent,
  deleteAgent,
  getMyEarnings,
};
