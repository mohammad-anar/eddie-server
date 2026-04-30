import { Coach, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { coachSearchableFields } from "./coach.constant.js";
import { ICoachFilterRequest } from "./coach.interface.js";

const createCoach = async (data: Coach): Promise<Coach> => {
  const result = await prisma.coach.create({
    data,
    include: {
      user: true,
    },
  });
  return result;
};

const getAllCoaches = async (
  filters: ICoachFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Coach[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: coachSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.CoachWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.coach.findMany({
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
      teams: {
        include: {
          team: true,
        },
      },
    },
  });

  const total = await prisma.coach.count({
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

const getSingleCoach = async (id: string): Promise<Coach | null> => {
  const result = await prisma.coach.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      teams: {
        include: {
          team: true,
        },
      },
      managedClubs: true,
      trophies: true,
      courses: true,
      formations: true,
      testimonials: true,
      docs: true,
    },
  });
  return result;
};

const updateCoach = async (
  id: string,
  payload: Partial<Coach>
): Promise<Coach | null> => {
  const result = await prisma.coach.update({
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

const deleteCoach = async (id: string): Promise<Coach | null> => {
  const result = await prisma.coach.delete({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

export const CoachService = {
  createCoach,
  getAllCoaches,
  getSingleCoach,
  updateCoach,
  deleteCoach,
};
