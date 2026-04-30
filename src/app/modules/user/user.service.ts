import { AdminRole, Prisma, User, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError.js";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IJWTPayload } from "../auth/auth.interface.js";
import { userSearchableFields } from "./user.constant.js";
import { IUserFilterRequest } from "./user.interface.js";
import { JwtPayload } from "jsonwebtoken";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";

const getMe = async (user: JwtPayload) => {
  const { id, role } = user;

  let profile = null;

  if (role === AdminRole.SUPER_ADMIN) {
    profile = await prisma.superAdmin.findUnique({
      where: { id },
    });
  } else {
    profile = await prisma.user.findUnique({
      where: { id, isDeleted: false },
      include: {
        player: true,
        coach: true,
        club: true,
        academyManager: {
          include: {
            academy: true,
          },
        },
        parent: true,
        agent: true,
        addresses: true,
      },
    });
  }

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
  }

  return profile;
};

const getAllUsers = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (key === "isVerified") {
          return {
            [key]: filterData[key as keyof typeof filterData] === "true",
          };
        }
        return {
          [key]: {
            equals: filterData[key as keyof typeof filterData],
          },
        };
      }),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
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
      player: true,
      coach: true,
      club: true,
      academyManager: true,
      parent: true,
      agent: true,
    },
  });

  const total = await prisma.user.count({
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

export const UserService = {
  getMe,
  getAllUsers,
};
