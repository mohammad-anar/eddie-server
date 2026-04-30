import { Parent, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { parentSearchableFields } from "./parent.constant.js";
import { IParentFilterRequest } from "./parent.interface.js";

const createParent = async (data: Parent): Promise<Parent> => {
  const result = await prisma.parent.create({
    data,
    include: {
      user: true,
      address: true,
    },
  });
  return result;
};

const getAllParents = async (
  filters: IParentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Parent[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: parentSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.ParentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.parent.findMany({
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
      address: true,
      players: {
        include: {
          player: true,
        },
      },
    },
  });

  const total = await prisma.parent.count({
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

const getSingleParent = async (id: string): Promise<Parent | null> => {
  const result = await prisma.parent.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      address: true,
      players: {
        include: {
          player: true,
        },
      },
    },
  });
  return result;
};

const updateParent = async (
  id: string,
  payload: Partial<Parent>
): Promise<Parent | null> => {
  const result = await prisma.parent.update({
    where: {
      id,
    },
    data: payload,
    include: {
      user: true,
      address: true,
    },
  });
  return result;
};

const deleteParent = async (id: string): Promise<Parent | null> => {
  const result = await prisma.parent.delete({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return result;
};

export const ParentService = {
  createParent,
  getAllParents,
  getSingleParent,
  updateParent,
  deleteParent,
};
