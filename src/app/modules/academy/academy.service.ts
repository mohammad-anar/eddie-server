import { Academy, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { academySearchableFields } from "./academy.constant.js";
import { IAcademyFilterRequest } from "./academy.interface.js";

const createAcademy = async (data: Academy): Promise<Academy> => {
  const result = await prisma.academy.create({
    data,
    include: {
      club: true,
    },
  });
  return result;
};

const getAllAcademies = async (
  filters: IAcademyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Academy[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: academySearchableFields.map((field) => ({
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

  const whereConditions: Prisma.AcademyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.academy.findMany({
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
      teams: true,
    },
  });

  const total = await prisma.academy.count({
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

const getSingleAcademy = async (id: string): Promise<Academy | null> => {
  const result = await prisma.academy.findUnique({
    where: {
      id,
    },
    include: {
      club: true,
      teams: true,
      managers: {
        include: {
          user: true,
        },
      },
    },
  });
  return result;
};

const updateAcademy = async (
  id: string,
  payload: Partial<Academy>
): Promise<Academy | null> => {
  const result = await prisma.academy.update({
    where: {
      id,
    },
    data: payload,
    include: {
      club: true,
    },
  });
  return result;
};

const deleteAcademy = async (id: string): Promise<Academy | null> => {
  const result = await prisma.academy.delete({
    where: {
      id,
    },
    include: {
      club: true,
    },
  });
  return result;
};

export const AcademyService = {
  createAcademy,
  getAllAcademies,
  getSingleAcademy,
  updateAcademy,
  deleteAcademy,
};
