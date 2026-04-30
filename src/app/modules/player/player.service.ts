import { Player, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { playerSearchableFields } from "./player.constant.js";
import { IPlayerFilterRequest } from "./player.interface.js";

const createPlayer = async (data: Player): Promise<Player> => {
  const result = await prisma.player.create({
    data: {
      ...data,
      dob: data.dob ? new Date(data.dob) : new Date(),
    },
    include: {
      user: true,
    },
  });
  return result;
};

const getAllPlayers = async (
  filters: IPlayerFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Player[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: playerSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.PlayerWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.player.findMany({
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
      academy: true,
      club: true,
      agent: true,
    },
  });

  const total = await prisma.player.count({
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

const getSinglePlayer = async (id: string): Promise<Player | null> => {
  const result = await prisma.player.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      birthCountry: true,
      dualNationality: true,
      contact: true,
      physicalStats: true,
      languages: true,
      maps: true,
      marketValues: true,
      careerHighlights: true,
      strength: true,
      performanceMatrix: true,
      detailedAnalysis: {
        include: {
          rows: true,
        },
      },
      cv: true,
      academy: true,
      club: true,
      agent: true,
      attributeAnalysis: {
        include: {
          technicalAbility: true,
          reactionSkills: true,
          physicalAttribute: true,
          mentalStrength: true,
          attackingSkill: true,
          defensiveSkill: true,
        },
      },
    },
  });
  return result;
};

const updatePlayer = async (
  id: string,
  payload: Partial<Player>
): Promise<Player | null> => {
  const result = await prisma.player.update({
    where: {
      id,
    },
    data: {
      ...payload,
      dob: payload.dob ? new Date(payload.dob) : undefined,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const deletePlayer = async (id: string): Promise<Player | null> => {
  const result = await prisma.player.delete({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

export const PlayerService = {
  createPlayer,
  getAllPlayers,
  getSinglePlayer,
  updatePlayer,
  deletePlayer,
};
