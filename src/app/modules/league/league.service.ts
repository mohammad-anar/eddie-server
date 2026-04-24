import { Prisma } from "@prisma/client";
import { prisma } from "../../../helpers/prisma.js";
import ApiError from "../../../errors/ApiError.js";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import {
  ICreateLeaguePayload,
  ILeagueFilterRequest,
  IJoinLeaguePayload,
} from "./league.interface.js";

type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

// Generate a random 6-character alphanumeric code
const generateCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createLeague = async (managerId: string, payload: ICreateLeaguePayload) => {
  const {
    leagueType,
    scoringSettings,
    draftTime,
    secondsPerPick = 60,
    rosterSize = 5,
    memberLimit = 10,
    ...rest
  } = payload;

  if (leagueType === "PRIVATE" && !payload.passcode) {
    throw new ApiError(400, "Passcode is required for private leagues");
  }

  // Ensure unique code
  let code = generateCode();
  while (await prisma.league.findUnique({ where: { code } })) {
    code = generateCode();
  }

  const result = await prisma.$transaction(async (tx) => {
    const league = await tx.league.create({
      data: {
        ...rest,
        code,
        managerId,
        memberLimit,
        rosterSize,
        draftTime: new Date(draftTime),
        status: "DRAFTING",
        // null out passcode if public
        passcode: leagueType === "PRIVATE" ? payload.passcode : null,
      },
    });

    // Create default scoring settings
    await tx.leagueScoringSettings.create({
      data: {
        leagueId: league.id,
        ...(scoringSettings || {}),
      },
    });

    // Create draft session
    await tx.draftSession.create({
      data: {
        leagueId: league.id,
        status: "WAITING",
        secondsPerPick,
        totalRounds: rosterSize,
      },
    });

    // Auto-join manager as first member
    await tx.leagueMember.create({
      data: { leagueId: league.id, userId: managerId },
    });

    // Create manager's team
    await tx.team.create({
      data: {
        leagueId: league.id,
        ownerId: managerId,
        name: `Team ${managerId.slice(0, 5)}`,
      },
    });

    return tx.league.findUnique({
      where: { id: league.id },
      include: { scoringSettings: true, draftSession: true, _count: { select: { members: true } } },
    });
  });

  return result;
};

const getAllLeagues = async (
  filter: ILeagueFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, leagueType, ...filterData } = filter;

  const andConditions: Prisma.LeagueWhereInput[] = [
    { deletedAt: null },
    { status: { not: "ARCHIVED" } },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: ["name", "code"].map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  // Filter by PUBLIC/PRIVATE: private leagues have a non-null passcode
  if (leagueType === "PUBLIC") {
    andConditions.push({ passcode: null });
  } else if (leagueType === "PRIVATE") {
    andConditions.push({ passcode: { not: null } });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const where: Prisma.LeagueWhereInput = { AND: andConditions };

  const [result, total] = await Promise.all([
    prisma.league.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: { select: { members: true } },
        manager: { select: { id: true, name: true, avatarUrl: true } },
      },
    }),
    prisma.league.count({ where }),
  ]);

  // Mask passcode — only expose whether it's private
  const sanitized = result.map((l) => ({
    ...l,
    isPrivate: l.passcode !== null,
    passcode: undefined,
  }));

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: sanitized,
  };
};

const getMyLeagues = async (userId: string) => {
  const memberships = await prisma.leagueMember.findMany({
    where: { userId },
    include: {
      league: {
        include: {
          _count: { select: { members: true } },
          teams: {
            where: { ownerId: userId },
            select: { id: true, name: true, totalPoints: true, rank: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return memberships.map((m) => ({
    ...m.league,
    myTeam: m.league.teams[0] || null,
    isPrivate: m.league.passcode !== null,
    passcode: undefined,
  }));
};

const getLeagueById = async (id: string) => {
  const result = await prisma.league.findUnique({
    where: { id, deletedAt: null },
    include: {
      manager: { select: { id: true, name: true, avatarUrl: true } },
      scoringSettings: true,
      draftSession: true,
      teams: {
        orderBy: { totalPoints: "desc" },
        include: {
          owner: { select: { id: true, name: true, username: true, avatarUrl: true } },
          teamFighters: { include: { fighter: true } },
        },
      },
      _count: { select: { members: true } },
    },
  });
  if (!result) throw new ApiError(404, "League not found");
  return { ...result, isPrivate: result.passcode !== null, passcode: undefined };
};

const joinLeague = async (userId: string, payload: IJoinLeaguePayload) => {
  const league = await prisma.league.findUnique({
    where: { code: payload.code, deletedAt: null },
    include: { _count: { select: { members: true } } },
  });

  if (!league) throw new ApiError(404, "League not found with this code");
  if (league.status === "COMPLETED" || league.status === "ARCHIVED") {
    throw new ApiError(400, "This league is no longer active");
  }
  if (league._count.members >= league.memberLimit) {
    throw new ApiError(400, "This league is full");
  }

  // Check if user already joined
  const existing = await prisma.leagueMember.findUnique({
    where: { leagueId_userId: { leagueId: league.id, userId } },
  });
  if (existing) throw new ApiError(409, "You have already joined this league");

  // Validate passcode for private leagues
  if (league.passcode && league.passcode !== payload.passcode) {
    throw new ApiError(403, "Invalid passcode");
  }

  return prisma.$transaction(async (tx) => {
    await tx.leagueMember.create({
      data: { leagueId: league.id, userId },
    });
    const team = await tx.team.create({
      data: {
        leagueId: league.id,
        ownerId: userId,
        name: payload.teamName,
      },
    });
    return { league, team };
  });
};

const joinQuickLeague = async (userId: string, teamName: string) => {
  // Find an existing system-generated league that isn't full
  const available = await prisma.league.findFirst({
    where: {
      status: "DRAFTING",
      deletedAt: null,
      isSystemGenerated: true,
      members: { none: { userId } },
    },
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: "asc" },
  });

  let targetLeague = available;

  if (!targetLeague || (targetLeague as any)._count.members >= targetLeague.memberLimit) {
    // Create a new system-generated league
    const code = generateCode();
    targetLeague = await prisma.league.create({
      data: {
        name: `Quick League ${Date.now()}`,
        code,
        managerId: userId,
        memberLimit: 10,
        rosterSize: 5,
        status: "DRAFTING",
        isSystemGenerated: true,
      },
      include: { _count: { select: { members: true } } },
    });

    await prisma.leagueScoringSettings.create({ data: { leagueId: targetLeague.id } });
    await prisma.draftSession.create({
      data: { leagueId: targetLeague.id, status: "WAITING", secondsPerPick: 60, totalRounds: 5 },
    });
  }

  return prisma.$transaction(async (tx) => {
    await tx.leagueMember.create({ data: { leagueId: targetLeague!.id, userId } });
    const team = await tx.team.create({
      data: { leagueId: targetLeague!.id, ownerId: userId, name: teamName },
    });
    return { league: targetLeague, team };
  });
};

const updateLeague = async (
  leagueId: string,
  managerId: string,
  payload: Prisma.LeagueUpdateInput
) => {
  const league = await prisma.league.findUnique({
    where: { id: leagueId, deletedAt: null },
  });
  if (!league) throw new ApiError(404, "League not found");
  if (league.managerId !== managerId)
    throw new ApiError(403, "Only the league manager can update this league");

  return prisma.league.update({ where: { id: leagueId }, data: payload });
};

const deleteLeague = async (
  leagueId: string,
  userId: string,
  role: string
) => {
  const league = await prisma.league.findUnique({
    where: { id: leagueId, deletedAt: null },
  });
  if (!league) throw new ApiError(404, "League not found");
  if (role !== "ADMIN" && league.managerId !== userId) {
    throw new ApiError(403, "You don't have permission to delete this league");
  }
  return prisma.league.update({
    where: { id: leagueId },
    data: { deletedAt: new Date() },
  });
};

export const LeagueService = {
  createLeague,
  getAllLeagues,
  getMyLeagues,
  getLeagueById,
  joinLeague,
  joinQuickLeague,
  updateLeague,
  deleteLeague,
};
