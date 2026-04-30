import { Agent, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { agentSearchableFields } from "./agent.constant.js";
import { IAgentFilterRequest } from "./agent.interface.js";

const createAgent = async (data: Agent): Promise<Agent> => {
  const result = await prisma.agent.create({
    data,
    include: {
      user: true,
      club: true,
    },
  });
  return result;
};

const getAllAgents = async (
  filters: IAgentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Agent[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: agentSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.AgentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.agent.findMany({
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
      club: true,
      _count: {
        select: {
          players: true,
        },
      },
    },
  });

  const total = await prisma.agent.count({
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

const getSingleAgent = async (id: string): Promise<Agent | null> => {
  const result = await prisma.agent.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      club: true,
      players: true,
      earnings: true,
      transfers: {
        include: {
          player: true,
        },
      },
    },
  });
  return result;
};

const updateAgent = async (
  id: string,
  payload: Partial<Agent>
): Promise<Agent | null> => {
  const result = await prisma.agent.update({
    where: {
      id,
    },
    data: payload,
    include: {
      user: true,
      club: true,
    },
  });
  return result;
};

const deleteAgent = async (id: string): Promise<Agent | null> => {
  const result = await prisma.agent.delete({
    where: {
      id,
    },
  });
  return result;
};

const getMyEarnings = async (agentId: string) => {
  const result = await prisma.agentEarnings.findMany({
    where: {
      agentId,
    },
    orderBy: {
      date: "desc",
    },
  });
  return result;
};

export const AgentService = {
  createAgent,
  getAllAgents,
  getSingleAgent,
  updateAgent,
  deleteAgent,
  getMyEarnings,
};
