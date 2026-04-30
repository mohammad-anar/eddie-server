import { Transfer, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { transferSearchableFields } from "./transfer.constant.js";
import { ITransferFilterRequest } from "./transfer.interface.js";

const createTransfer = async (data: Transfer): Promise<Transfer> => {
  const result = await prisma.transfer.create({
    data: {
      ...data,
      agreementDate: data.agreementDate ? new Date(data.agreementDate) : undefined,
      completionDate: data.completionDate ? new Date(data.completionDate) : undefined,
    },
    include: {
      player: true,
      agent: true,
      sourceClub: true,
      sourceAcademy: true,
      destClub: true,
      destAcademy: true,
    },
  });
  return result;
};

const getAllTransfers = async (
  filters: ITransferFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Transfer[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: transferSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.TransferWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.transfer.findMany({
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
      agent: true,
      sourceClub: true,
      sourceAcademy: true,
      destClub: true,
      destAcademy: true,
    },
  });

  const total = await prisma.transfer.count({
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

const getSingleTransfer = async (id: string): Promise<Transfer | null> => {
  const result = await prisma.transfer.findUnique({
    where: {
      id,
    },
    include: {
      player: true,
      agent: true,
      sourceClub: true,
      sourceAcademy: true,
      destClub: true,
      destAcademy: true,
    },
  });
  return result;
};

const updateTransfer = async (
  id: string,
  payload: Partial<Transfer>
): Promise<Transfer | null> => {
  const result = await prisma.transfer.update({
    where: {
      id,
    },
    data: {
      ...payload,
      agreementDate: payload.agreementDate ? new Date(payload.agreementDate) : undefined,
      completionDate: payload.completionDate ? new Date(payload.completionDate) : undefined,
    },
    include: {
      player: true,
      agent: true,
      sourceClub: true,
      sourceAcademy: true,
      destClub: true,
      destAcademy: true,
    },
  });
  return result;
};

const deleteTransfer = async (id: string): Promise<Transfer | null> => {
  const result = await prisma.transfer.delete({
    where: {
      id,
    },
  });
  return result;
};

export const TransferService = {
  createTransfer,
  getAllTransfers,
  getSingleTransfer,
  updateTransfer,
  deleteTransfer,
};
