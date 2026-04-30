import { Sponsor, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { sponsorSearchableFields } from "./sponsor.constant.js";
import { ISponsorFilterRequest } from "./sponsor.interface.js";

const createSponsor = async (data: Sponsor): Promise<Sponsor> => {
  const result = await prisma.sponsor.create({
    data: {
      ...data,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    },
    include: {
      academy: true,
    },
  });
  return result;
};

const getAllSponsors = async (
  filters: ISponsorFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Sponsor[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: sponsorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.SponsorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.sponsor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      academy: true,
    },
  });

  const total = await prisma.sponsor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleSponsor = async (id: string): Promise<Sponsor | null> => {
  const result = await prisma.sponsor.findUnique({
    where: {
      id,
    },
    include: {
      academy: true,
    },
  });
  return result;
};

const updateSponsor = async (
  id: string,
  payload: Partial<Sponsor>
): Promise<Sponsor | null> => {
  const result = await prisma.sponsor.update({
    where: {
      id,
    },
    data: {
      ...payload,
      startTime: payload.startTime ? new Date(payload.startTime) : undefined,
      endTime: payload.endTime ? new Date(payload.endTime) : undefined,
    },
    include: {
      academy: true,
    },
  });
  return result;
};

const deleteSponsor = async (id: string): Promise<Sponsor | null> => {
  const result = await prisma.sponsor.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SponsorService = {
  createSponsor,
  getAllSponsors,
  getSingleSponsor,
  updateSponsor,
  deleteSponsor,
};
