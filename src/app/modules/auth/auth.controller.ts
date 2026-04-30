import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { AuthService } from "./auth.service.js";
import { IJWTPayload } from "./auth.interface.js";
import { getSingleFilePath } from "../../shared/getFilePath.js";


const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin logged in successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await AuthService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await AuthService.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resetPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJWTPayload;
  const result = await AuthService.changePassword(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const createClub = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJWTPayload;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.avatar = getSingleFilePath(req.files, "image");
  }
  const result = await AuthService.createClub(user, req.body.data || req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Club created successfully",
    data: result,
  });
});

const createAcademy = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJWTPayload;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.avatar = getSingleFilePath(req.files, "image");
  }
  const result = await AuthService.createAcademy(user, req.body.data || req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Academy created successfully",
    data: result,
  });
});

const createPlayer = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJWTPayload;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.avatar = getSingleFilePath(req.files, "image");
  }
  const result = await AuthService.createPlayer(user, req.body.data || req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Player created successfully",
    data: result,
  });
});

const createAgent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJWTPayload;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.avatar = getSingleFilePath(req.files, "image");
  }
  const result = await AuthService.createAgent(user, req.body.data || req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Agent created successfully",
    data: result,
  });
});

const createCoach = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IJWTPayload;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.avatar = getSingleFilePath(req.files, "image");
  }
  const result = await AuthService.createCoach(user, req.body.data || req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Coach created successfully",
    data: result,
  });
});

export const AuthController = {
  loginAdmin,
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
  createClub,
  createAcademy,
  createPlayer,
  createAgent,
  createCoach,
};
