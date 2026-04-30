import { Team, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { teamSearchableFields } from "./team.constant.js";
import { ITeamFilterRequest } from "./team.interface.js";

const createTeam = async (data: Team): Promise<Team> => {
  const result = await prisma.team.create({
    data,
  });
  return result;
};

const getAllTeams = async (
  filters: ITeamFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Team[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: teamSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.TeamWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.team.findMany({
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
      club: true,
      academy: true,
      players: true,
    },
  });

  const total = await prisma.team.count({
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

const getSingleTeam = async (id: string): Promise<Team | null> => {
  const result = await prisma.team.findUnique({
    where: {
      id,
    },
    include: {
      club: true,
      academy: true,
      players: true,
      coaches: {
        include: {
          coach: true,
        },
      },
    },
  });
  return result;
};

const updateTeam = async (
  id: string,
  payload: Partial<Team>
): Promise<Team | null> => {
  const result = await prisma.team.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteTeam = async (id: string): Promise<Team | null> => {
  const result = await prisma.team.delete({
    where: {
      id,
    },
  });
  return result;
};

export const TeamService = {
  createTeam,
  getAllTeams,
  getSingleTeam,
  updateTeam,
  deleteTeam,
};
