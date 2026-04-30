import { Club, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { clubSearchableFields } from "./club.constant.js";
import { IClubFilterRequest } from "./club.interface.js";

const createClub = async (data: Club): Promise<Club> => {
  const result = await prisma.club.create({
    data,
    include: {
      user: true,
    },
  });
  return result;
};

const getAllClubs = async (
  filters: IClubFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Club[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: clubSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.ClubWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.club.findMany({
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
      user: true,
      academies: true,
      teams: true,
    },
  });

  const total = await prisma.club.count({
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

const getSingleClub = async (id: string): Promise<Club | null> => {
  const result = await prisma.club.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      academies: true,
      teams: true,
      achievements: true,
    },
  });
  return result;
};

const updateClub = async (
  id: string,
  payload: Partial<Club>
): Promise<Club | null> => {
  const result = await prisma.club.update({
    where: {
      id,
    },
    data: payload,
    include: {
      user: true,
    },
  });
  return result;
};

const deleteClub = async (id: string): Promise<Club | null> => {
  const result = await prisma.club.delete({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

export const ClubService = {
  createClub,
  getAllClubs,
  getSingleClub,
  updateClub,
  deleteClub,
};
