import { Prisma } from "@prisma/client";
import { prisma } from "../../../helpers/prisma.js";
import ApiError from "../../../errors/ApiError.js";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { IFighterFilterRequest } from "./fighter.interface.js";

type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

const createFighter = async (payload: Prisma.FighterCreateInput) => {
  const result = await prisma.fighter.create({ data: payload });
  return result;
};

const getAllFighters = async (
  filter: IFighterFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filter;

  const andConditions: Prisma.FighterWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["name", "nickname", "nationality"].map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const where: Prisma.FighterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [result, total] = await Promise.all([
    prisma.fighter.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.fighter.count({ where }),
  ]);

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const getFighterById = async (id: string) => {
  const result = await prisma.fighter.findUnique({
    where: { id },
    include: { boutFighters: { include: { bout: true } } },
  });
  if (!result) throw new ApiError(404, "Fighter not found");
  return result;
};

const updateFighter = async (
  id: string,
  payload: Prisma.FighterUpdateInput
) => {
  await getFighterById(id);
  return prisma.fighter.update({ where: { id }, data: payload });
};

const deleteFighter = async (id: string) => {
  await getFighterById(id);
  return prisma.fighter.update({ where: { id }, data: { isActive: false } });
};

export const FighterService = {
  createFighter,
  getAllFighters,
  getFighterById,
  updateFighter,
  deleteFighter,
};
