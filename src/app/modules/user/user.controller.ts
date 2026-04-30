import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service.js";
import pick from "@/helpers/pick.js";
import { userFilterableFields, paginationFields } from "./user.constant.js";
import catchAsync from "@/app/shared/catchAsync.js";
import sendResponse from "@/app/shared/sendResponse.js";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getMe(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await UserService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  getMe,
  getAllUsers,
};
