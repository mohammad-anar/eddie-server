import { Match, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { matchSearchableFields } from "./match.constant.js";
import { IMatchFilterRequest } from "./match.interface.js";

const createMatch = async (data: Match): Promise<Match> => {
  const result = await prisma.match.create({
    data: {
      ...data,
      kickoffAt: new Date(data.kickoffAt),
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
  return result;
};

const getAllMatches = async (
  filters: IMatchFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Match[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: matchSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.MatchWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.match.findMany({
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
      homeTeam: true,
      awayTeam: true,
      league: true,
      club: true,
      academy: true,
    },
  });

  const total = await prisma.match.count({
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

const getSingleMatch = async (id: string): Promise<Match | null> => {
  const result = await prisma.match.findUnique({
    where: {
      id,
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      league: true,
      club: true,
      academy: true,
      gameReport: {
        include: {
          player: true,
        },
      },
      matchStatistics: true,
      matchMedia: true,
      matchCost: true,
    },
  });
  return result;
};

const updateMatch = async (
  id: string,
  payload: Partial<Match>
): Promise<Match | null> => {
  const result = await prisma.match.update({
    where: {
      id,
    },
    data: {
      ...payload,
      kickoffAt: payload.kickoffAt ? new Date(payload.kickoffAt) : undefined,
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });
  return result;
};

const deleteMatch = async (id: string): Promise<Match | null> => {
  const result = await prisma.match.delete({
    where: {
      id,
    },
  });
  return result;
};

export const MatchService = {
  createMatch,
  getAllMatches,
  getSingleMatch,
  updateMatch,
  deleteMatch,
};
