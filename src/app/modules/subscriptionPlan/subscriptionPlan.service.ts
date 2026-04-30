import { SubscriptionPlan, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { subscriptionPlanSearchableFields } from "./subscriptionPlan.constant.js";
import { ISubscriptionPlanFilterRequest } from "./subscriptionPlan.interface.js";

const createSubscriptionPlan = async (data: SubscriptionPlan): Promise<SubscriptionPlan> => {
  const result = await prisma.subscriptionPlan.create({
    data,
  });
  return result;
};

const getAllSubscriptionPlans = async (
  filters: ISubscriptionPlanFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SubscriptionPlan[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: subscriptionPlanSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.SubscriptionPlanWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.subscriptionPlan.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.subscriptionPlan.count({
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

const getSingleSubscriptionPlan = async (id: string): Promise<SubscriptionPlan | null> => {
  const result = await prisma.subscriptionPlan.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateSubscriptionPlan = async (
  id: string,
  payload: Partial<SubscriptionPlan>
): Promise<SubscriptionPlan | null> => {
  const result = await prisma.subscriptionPlan.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSubscriptionPlan = async (id: string): Promise<SubscriptionPlan | null> => {
  const result = await prisma.subscriptionPlan.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SubscriptionPlanService = {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSingleSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
};
