-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "LeagueStatus" AS ENUM ('DRAFTING', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('WAITING', 'OPEN', 'DRAFTING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BoutResult" AS ENUM ('KO_TKO', 'SUBMISSION', 'DECISION_UNANIMOUS', 'DECISION_SPLIT', 'DECISION_MAJORITY', 'DRAW', 'NO_CONTEST', 'DQ');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DRAFT_STARTING', 'DRAFT_PICK', 'RESULTS_POSTED', 'LEAGUE_INVITE', 'TRADE_OFFER', 'SYSTEM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fighters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT '',
    "nationality" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "rank" INTEGER,
    "isChampion" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT,
    "age" INTEGER,
    "height" TEXT,
    "reach" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "koWins" INTEGER NOT NULL DEFAULT 0,
    "submissionWins" INTEGER NOT NULL DEFAULT 0,
    "decisionWins" INTEGER NOT NULL DEFAULT 0,
    "titleDefenses" INTEGER NOT NULL DEFAULT 0,
    "formerChampionDivisions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fighters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "posterUrl" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "hasResults" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bouts" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "weightClass" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL DEFAULT 3,
    "isMainEvent" BOOLEAN NOT NULL DEFAULT false,
    "isCoMainEvent" BOOLEAN NOT NULL DEFAULT false,
    "isTitleFight" BOOLEAN NOT NULL DEFAULT false,
    "winnerId" TEXT,
    "result" "BoutResult",
    "isChampionVsChampion" BOOLEAN NOT NULL DEFAULT false,
    "isWinnerAgainstRanked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bout_fighters" (
    "id" TEXT NOT NULL,
    "boutId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "corner" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bout_fighters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "passcode" TEXT,
    "managerId" TEXT NOT NULL,
    "memberLimit" INTEGER NOT NULL DEFAULT 8,
    "rosterSize" INTEGER NOT NULL DEFAULT 5,
    "status" "LeagueStatus" NOT NULL DEFAULT 'DRAFTING',
    "draftTime" TIMESTAMP(3),
    "isSystemGenerated" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league_members" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "league_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league_scoring_settings" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "winPoints" INTEGER NOT NULL DEFAULT 1,
    "finishBonus" INTEGER NOT NULL DEFAULT 1,
    "winningChampionshipBout" INTEGER NOT NULL DEFAULT 1,
    "championVsChampionWin" INTEGER NOT NULL DEFAULT 1,
    "winningAgainstRankedOpponent" INTEGER NOT NULL DEFAULT 1,
    "winningFiveRoundFight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "league_scoring_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "iconGlyph" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_fighters" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_fighters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_sessions" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "status" "DraftStatus" NOT NULL DEFAULT 'WAITING',
    "currentRound" INTEGER NOT NULL DEFAULT 1,
    "currentPickIndex" INTEGER NOT NULL DEFAULT 0,
    "secondsPerPick" INTEGER NOT NULL DEFAULT 60,
    "totalRounds" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "draft_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_orders" (
    "id" TEXT NOT NULL,
    "draftSessionId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "pickPosition" INTEGER NOT NULL,
    "overallPick" INTEGER NOT NULL,

    CONSTRAINT "draft_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_picks" (
    "id" TEXT NOT NULL,
    "draftSessionId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "pickNumber" INTEGER NOT NULL,
    "pickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draft_picks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_bout_scores" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "boutId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "winPoints" INTEGER NOT NULL DEFAULT 0,
    "finishBonus" INTEGER NOT NULL DEFAULT 0,
    "championshipPoints" INTEGER NOT NULL DEFAULT 0,
    "champVsChampPoints" INTEGER NOT NULL DEFAULT 0,
    "rankedOpponentPoints" INTEGER NOT NULL DEFAULT 0,
    "fiveRoundPoints" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_bout_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "fighters_division_idx" ON "fighters"("division");

-- CreateIndex
CREATE INDEX "fighters_rank_idx" ON "fighters"("rank");

-- CreateIndex
CREATE INDEX "fighters_isChampion_idx" ON "fighters"("isChampion");

-- CreateIndex
CREATE INDEX "fighters_isActive_idx" ON "fighters"("isActive");

-- CreateIndex
CREATE INDEX "fighters_division_rank_idx" ON "fighters"("division", "rank");

-- CreateIndex
CREATE INDEX "events_date_idx" ON "events"("date");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "bouts_eventId_idx" ON "bouts"("eventId");

-- CreateIndex
CREATE INDEX "bouts_winnerId_idx" ON "bouts"("winnerId");

-- CreateIndex
CREATE INDEX "bouts_eventId_order_idx" ON "bouts"("eventId", "order");

-- CreateIndex
CREATE INDEX "bout_fighters_boutId_idx" ON "bout_fighters"("boutId");

-- CreateIndex
CREATE INDEX "bout_fighters_fighterId_idx" ON "bout_fighters"("fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "bout_fighters_boutId_fighterId_key" ON "bout_fighters"("boutId", "fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "leagues_code_key" ON "leagues"("code");

-- CreateIndex
CREATE INDEX "leagues_managerId_idx" ON "leagues"("managerId");

-- CreateIndex
CREATE INDEX "leagues_code_idx" ON "leagues"("code");

-- CreateIndex
CREATE INDEX "leagues_status_idx" ON "leagues"("status");

-- CreateIndex
CREATE INDEX "league_members_leagueId_idx" ON "league_members"("leagueId");

-- CreateIndex
CREATE INDEX "league_members_userId_idx" ON "league_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "league_members_leagueId_userId_key" ON "league_members"("leagueId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "league_scoring_settings_leagueId_key" ON "league_scoring_settings"("leagueId");

-- CreateIndex
CREATE INDEX "teams_leagueId_idx" ON "teams"("leagueId");

-- CreateIndex
CREATE INDEX "teams_ownerId_idx" ON "teams"("ownerId");

-- CreateIndex
CREATE INDEX "teams_leagueId_totalPoints_idx" ON "teams"("leagueId", "totalPoints" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "teams_leagueId_ownerId_key" ON "teams"("leagueId", "ownerId");

-- CreateIndex
CREATE INDEX "team_fighters_teamId_idx" ON "team_fighters"("teamId");

-- CreateIndex
CREATE INDEX "team_fighters_fighterId_idx" ON "team_fighters"("fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "team_fighters_teamId_fighterId_key" ON "team_fighters"("teamId", "fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "draft_sessions_leagueId_key" ON "draft_sessions"("leagueId");

-- CreateIndex
CREATE INDEX "draft_orders_draftSessionId_idx" ON "draft_orders"("draftSessionId");

-- CreateIndex
CREATE INDEX "draft_orders_teamId_idx" ON "draft_orders"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "draft_orders_draftSessionId_overallPick_key" ON "draft_orders"("draftSessionId", "overallPick");

-- CreateIndex
CREATE INDEX "draft_picks_draftSessionId_idx" ON "draft_picks"("draftSessionId");

-- CreateIndex
CREATE INDEX "draft_picks_teamId_idx" ON "draft_picks"("teamId");

-- CreateIndex
CREATE INDEX "draft_picks_fighterId_idx" ON "draft_picks"("fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "draft_picks_draftSessionId_fighterId_key" ON "draft_picks"("draftSessionId", "fighterId");

-- CreateIndex
CREATE INDEX "team_bout_scores_teamId_idx" ON "team_bout_scores"("teamId");

-- CreateIndex
CREATE INDEX "team_bout_scores_boutId_idx" ON "team_bout_scores"("boutId");

-- CreateIndex
CREATE INDEX "team_bout_scores_fighterId_idx" ON "team_bout_scores"("fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "team_bout_scores_teamId_boutId_fighterId_key" ON "team_bout_scores"("teamId", "boutId", "fighterId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- AddForeignKey
ALTER TABLE "bouts" ADD CONSTRAINT "bouts_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bouts" ADD CONSTRAINT "bouts_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_fighters" ADD CONSTRAINT "bout_fighters_boutId_fkey" FOREIGN KEY ("boutId") REFERENCES "bouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bout_fighters" ADD CONSTRAINT "bout_fighters_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leagues" ADD CONSTRAINT "leagues_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_members" ADD CONSTRAINT "league_members_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_members" ADD CONSTRAINT "league_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "league_scoring_settings" ADD CONSTRAINT "league_scoring_settings_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_fighters" ADD CONSTRAINT "team_fighters_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_fighters" ADD CONSTRAINT "team_fighters_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_sessions" ADD CONSTRAINT "draft_sessions_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_orders" ADD CONSTRAINT "draft_orders_draftSessionId_fkey" FOREIGN KEY ("draftSessionId") REFERENCES "draft_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_orders" ADD CONSTRAINT "draft_orders_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_picks" ADD CONSTRAINT "draft_picks_draftSessionId_fkey" FOREIGN KEY ("draftSessionId") REFERENCES "draft_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_picks" ADD CONSTRAINT "draft_picks_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "draft_picks" ADD CONSTRAINT "draft_picks_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_bout_scores" ADD CONSTRAINT "team_bout_scores_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_bout_scores" ADD CONSTRAINT "team_bout_scores_boutId_fkey" FOREIGN KEY ("boutId") REFERENCES "bouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_bout_scores" ADD CONSTRAINT "team_bout_scores_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
