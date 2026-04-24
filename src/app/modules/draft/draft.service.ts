import { Prisma } from "@prisma/client";
import { prisma } from "../../../helpers/prisma.js";
import ApiError from "../../../errors/ApiError.js";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { IDraftFilterRequest, IPickFighterPayload, ISetQueuePayload } from "./draft.interface.js";

type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

const getDraftSession = async (leagueId: string) => {
  const session = await prisma.draftSession.findUnique({
    where: { leagueId },
    include: {
      league: {
        select: { id: true, name: true, memberLimit: true, rosterSize: true },
      },
      draftOrder: {
        orderBy: { overallPick: "asc" },
        include: { team: { include: { owner: { select: { id: true, name: true, avatarUrl: true } } } } },
      },
      draftPicks: {
        orderBy: { pickedAt: "asc" },
        include: { fighter: true, team: { select: { id: true, name: true } } },
      },
    },
  });
  if (!session) throw new ApiError(404, "Draft session not found for this league");
  return session;
};

const getAvailableFighters = async (
  leagueId: string,
  filter: IDraftFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const session = await prisma.draftSession.findUnique({ where: { leagueId } });
  if (!session) throw new ApiError(404, "Draft session not found");

  // Get already-picked fighter IDs for this draft
  const pickedFighterIds = (
    await prisma.draftPick.findMany({
      where: { draftSessionId: session.id },
      select: { fighterId: true },
    })
  ).map((p) => p.fighterId);

  const andConditions: Prisma.FighterWhereInput[] = [
    { isActive: true },
    { id: { notIn: pickedFighterIds } },
  ];

  if (filter.searchTerm) {
    andConditions.push({
      OR: ["name", "nickname"].map((f) => ({
        [f]: { contains: filter.searchTerm, mode: "insensitive" },
      })),
    });
  }
  if (filter.division) {
    andConditions.push({ division: { equals: filter.division, mode: "insensitive" } });
  }

  const where: Prisma.FighterWhereInput = { AND: andConditions };

  const [result, total] = await Promise.all([
    prisma.fighter.findMany({
      where,
      skip,
      take: limit,
      orderBy: sortBy === "rank" ? [{ rank: "asc" }, { name: "asc" }] : { [sortBy]: sortOrder as any },
    }),
    prisma.fighter.count({ where }),
  ]);

  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    data: result,
  };
};

const startDraft = async (
  leagueId: string,
  requesterId: string,
  role: string
) => {
  const league = await prisma.league.findUnique({
    where: { id: leagueId, deletedAt: null },
    include: { teams: true, _count: { select: { members: true } } },
  });
  if (!league) throw new ApiError(404, "League not found");
  if (role !== "ADMIN" && league.managerId !== requesterId) {
    throw new ApiError(403, "Only the league manager or admin can start the draft");
  }

  const session = await prisma.draftSession.findUnique({ where: { leagueId } });
  if (!session) throw new ApiError(404, "Draft session not found");
  if (session.status !== "WAITING" && session.status !== "OPEN") {
    throw new ApiError(400, `Cannot start draft — current status is ${session.status}`);
  }

  const teams = league.teams;
  const n = teams.length;
  const totalRounds = league.rosterSize;
  const totalPicks = n * totalRounds;

  // Build snake draft order
  const draftOrderData: {
    draftSessionId: string;
    teamId: string;
    round: number;
    pickPosition: number;
    overallPick: number;
  }[] = [];

  for (let round = 1; round <= totalRounds; round++) {
    const isEvenRound = round % 2 === 0;
    const teamOrder = isEvenRound ? [...teams].reverse() : [...teams];

    teamOrder.forEach((team, pos) => {
      const overallPick = (round - 1) * n + pos + 1;
      draftOrderData.push({
        draftSessionId: session.id,
        teamId: team.id,
        round,
        pickPosition: pos + 1,
        overallPick,
      });
    });
  }

  return prisma.$transaction(async (tx) => {
    // Clear any existing draft order
    await tx.draftOrder.deleteMany({ where: { draftSessionId: session.id } });
    await tx.draftOrder.createMany({ data: draftOrderData });

    return tx.draftSession.update({
      where: { id: session.id },
      data: {
        status: "DRAFTING",
        startedAt: new Date(),
        currentRound: 1,
        currentPickIndex: 0,
        totalRounds,
      },
      include: {
        draftOrder: {
          orderBy: { overallPick: "asc" },
          include: { team: true },
        },
      },
    });
  });
};

const pickFighter = async (
  leagueId: string,
  userId: string,
  payload: IPickFighterPayload
) => {
  const session = await prisma.draftSession.findUnique({
    where: { leagueId },
    include: {
      draftOrder: { orderBy: { overallPick: "asc" } },
    },
  });

  if (!session) throw new ApiError(404, "Draft session not found");
  if (session.status !== "DRAFTING") {
    throw new ApiError(400, `Draft is not in progress — status: ${session.status}`);
  }

  // Determine which pick slot we're on
  const currentOrderSlot = session.draftOrder[session.currentPickIndex];
  if (!currentOrderSlot) {
    throw new ApiError(400, "Invalid pick index — draft may be complete");
  }

  // Validate the picking team belongs to this user
  const team = await prisma.team.findUnique({ where: { id: currentOrderSlot.teamId } });
  if (!team || team.ownerId !== userId) {
    throw new ApiError(403, "It is not your turn to pick");
  }

  // Ensure fighter is not already picked in this draft
  const alreadyPicked = await prisma.draftPick.findUnique({
    where: {
      draftSessionId_fighterId: {
        draftSessionId: session.id,
        fighterId: payload.fighterId,
      },
    },
  });
  if (alreadyPicked) {
    throw new ApiError(409, "This fighter has already been picked");
  }

  // Ensure fighter is active
  const fighter = await prisma.fighter.findUnique({ where: { id: payload.fighterId } });
  if (!fighter || !fighter.isActive) {
    throw new ApiError(404, "Fighter not found or inactive");
  }

  const totalPicks = session.draftOrder.length;
  const nextPickIndex = session.currentPickIndex + 1;
  const isDraftComplete = nextPickIndex >= totalPicks;

  const nextRound = isDraftComplete
    ? session.currentRound
    : session.draftOrder[nextPickIndex]?.round ?? session.currentRound;

  return prisma.$transaction(async (tx) => {
    // Record the pick
    await tx.draftPick.create({
      data: {
        draftSessionId: session.id,
        teamId: currentOrderSlot.teamId,
        fighterId: payload.fighterId,
        round: currentOrderSlot.round,
        pickNumber: currentOrderSlot.overallPick,
      },
    });

    // Add fighter to team's active roster
    await tx.teamFighter.create({
      data: {
        teamId: currentOrderSlot.teamId,
        fighterId: payload.fighterId,
      },
    });

    // Advance session state
    const updatedSession = await tx.draftSession.update({
      where: { id: session.id },
      data: {
        currentPickIndex: nextPickIndex,
        currentRound: nextRound,
        status: isDraftComplete ? "COMPLETED" : "DRAFTING",
        completedAt: isDraftComplete ? new Date() : undefined,
      },
    });

    if (isDraftComplete) {
      // Update league status to ACTIVE
      await tx.league.update({
        where: { id: leagueId },
        data: { status: "ACTIVE" },
      });
    }

    return { updatedSession, fighter, team };
  });
};

const autoPick = async (leagueId: string, teamId: string) => {
  const session = await prisma.draftSession.findUnique({ where: { leagueId } });
  if (!session) throw new ApiError(404, "Draft session not found");

  // Get already-picked IDs
  const pickedIds = (
    await prisma.draftPick.findMany({
      where: { draftSessionId: session.id },
      select: { fighterId: true },
    })
  ).map((p) => p.fighterId);

  // Pick highest-ranked available fighter
  const topFighter = await prisma.fighter.findFirst({
    where: { isActive: true, id: { notIn: pickedIds } },
    orderBy: [{ rank: "asc" }, { wins: "desc" }],
  });

  if (!topFighter) throw new ApiError(404, "No available fighters to auto-pick");

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new ApiError(404, "Team not found");

  return pickFighter(leagueId, team.ownerId, { fighterId: topFighter.id });
};

export const DraftService = {
  getDraftSession,
  getAvailableFighters,
  startDraft,
  pickFighter,
  autoPick,
};
