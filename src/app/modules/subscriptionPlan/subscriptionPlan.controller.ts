import { Request, Response } from "express";
import httpStatus from "http-status";
import { SubscriptionPlanService } from "./subscriptionPlan.service.js";
import pick from "../../../helpers/pick.js";
import { subscriptionPlanFilterableFields, paginationFields } from "./subscriptionPlan.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

const createSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionPlanService.createSubscriptionPlan(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plan created successfully",
    data: result,
  });
});

const getAllSubscriptionPlans = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, subscriptionPlanFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await SubscriptionPlanService.getAllSubscriptionPlans(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plans retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubscriptionPlanService.getSingleSubscriptionPlan(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plan retrieved successfully",
    data: result,
  });
});

const updateSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubscriptionPlanService.updateSubscriptionPlan(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plan updated successfully",
    data: result,
  });
});

const deleteSubscriptionPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SubscriptionPlanService.deleteSubscriptionPlan(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plan deleted successfully",
    data: result,
  });
});

export const SubscriptionPlanController = {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSingleSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};
