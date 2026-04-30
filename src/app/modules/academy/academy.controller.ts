import { Request, Response } from "express";
import httpStatus from "http-status";
import { AcademyService } from "./academy.service.js";
import pick from "../../../helpers/pick.js";
import { academyFilterableFields, paginationFields } from "./academy.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

import { getSingleFilePath } from "../../shared/getFilePath.js";

const createAcademy = catchAsync(async (req: Request, res: Response) => {
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.logo = getSingleFilePath(req.files, "logo");
    req.body.data.coverPhoto = getSingleFilePath(req.files, "coverPhoto");
    req.body.data.nationalityFlag = getSingleFilePath(req.files, "nationalityFlag");
  }
  const result = await AcademyService.createAcademy(req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academy created successfully",
    data: result,
  });
});

const getAllAcademies = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, academyFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await AcademyService.getAllAcademies(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academies retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAcademy = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AcademyService.getSingleAcademy(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academy retrieved successfully",
    data: result,
  });
});

const updateAcademy = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.logo = getSingleFilePath(req.files, "logo");
    req.body.data.coverPhoto = getSingleFilePath(req.files, "coverPhoto");
    req.body.data.nationalityFlag = getSingleFilePath(req.files, "nationalityFlag");
  }
  const result = await AcademyService.updateAcademy(id as string, req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academy updated successfully",
    data: result,
  });
});

const deleteAcademy = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AcademyService.deleteAcademy(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academy deleted successfully",
    data: result,
  });
});

export const AcademyController = {
  createAcademy,
  getAllAcademies,
  getSingleAcademy,
  updateAcademy,
  deleteAcademy,
};
