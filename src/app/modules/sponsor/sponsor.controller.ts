import { Request, Response } from "express";
import httpStatus from "http-status";
import { SponsorService } from "./sponsor.service.js";
import pick from "../../../helpers/pick.js";
import { sponsorFilterableFields, paginationFields } from "./sponsor.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";

const createSponsor = catchAsync(async (req: Request, res: Response) => {
  if (req.body.data) {
    req.body.data = JSON.parse(req.body.data);
  }
  const result = await SponsorService.createSponsor(req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsor created successfully",
    data: result,
  });
});

const getAllSponsors = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, sponsorFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await SponsorService.getAllSponsors(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsors retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSponsor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SponsorService.getSingleSponsor(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsor retrieved successfully",
    data: result,
  });
});

const updateSponsor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.body.data) {
    req.body.data = JSON.parse(req.body.data);
  }
  const result = await SponsorService.updateSponsor(id as string, req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsor updated successfully",
    data: result,
  });
});

const deleteSponsor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SponsorService.deleteSponsor(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sponsor deleted successfully",
    data: result,
  });
});

export const SponsorController = {
  createSponsor,
  getAllSponsors,
  getSingleSponsor,
  updateSponsor,
  deleteSponsor,
};
