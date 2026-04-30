import { League, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { leagueSearchableFields } from "./league.constant.js";
import { ILeagueFilterRequest } from "./league.interface.js";

const createLeague = async (data: League): Promise<League> => {
  const result = await prisma.league.create({
    data,
  });
  return result;
};

const getAllLeagues = async (
  filters: ILeagueFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<League[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: leagueSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.LeagueWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.league.findMany({
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
      clubs: true,
    },
  });

  const total = await prisma.league.count({
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

const getSingleLeague = async (id: string): Promise<League | null> => {
  const result = await prisma.league.findUnique({
    where: {
      id,
    },
    include: {
      clubs: true,
      matches: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  });
  return result;
};

const updateLeague = async (
  id: string,
  payload: Partial<League>
): Promise<League | null> => {
  const result = await prisma.league.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteLeague = async (id: string): Promise<League | null> => {
  const result = await prisma.league.delete({
    where: {
      id,
    },
  });
  return result;
};

export const LeagueService = {
  createLeague,
  getAllLeagues,
  getSingleLeague,
  updateLeague,
  deleteLeague,
};
