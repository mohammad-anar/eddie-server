-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PROFESSIONAL_CLUB', 'ACADEMY', 'ACADEMY_MANAGER', 'TEAM', 'COACH', 'PARENT', 'PLAYER', 'AGENT', 'TEAM_MANAGER');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "PlayerPosition" AS ENUM ('GOALKEEPER', 'CENTER_BACK', 'LEFT_BACK', 'RIGHT_BACK', 'LEFT_WING_BACK', 'RIGHT_WING_BACK', 'SWEEPER', 'DEFENSIVE_MIDFIELDER', 'CENTRAL_MIDFIELDER', 'ATTACKING_MIDFIELDER', 'LEFT_MIDFIELDER', 'RIGHT_MIDFIELDER', 'WIDE_MIDFIELDER', 'BOX_TO_BOX_MIDFIELDER', 'DEEP_LYING_PLAYMAKER', 'LEFT_WINGER', 'RIGHT_WINGER', 'CENTER_FORWARD', 'STRIKER', 'SECOND_STRIKER', 'FALSE_NINE');

-- CreateEnum
CREATE TYPE "LanguageFluency" AS ENUM ('BASIC', 'ELEMENTARY', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED', 'FLUENT', 'NATIVE');

-- CreateEnum
CREATE TYPE "MapType" AS ENUM ('POSITION_MAP', 'FUTSAL_MAP');

-- CreateEnum
CREATE TYPE "SponsorType" AS ENUM ('GOLD', 'SILVER', 'BRONZE', 'PLATINUM');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER');

-- CreateEnum
CREATE TYPE "AgentVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'NEGOTIATING', 'AGREED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InitiatorType" AS ENUM ('AGENT', 'CLUB', 'ACADEMY', 'ADMIN');

-- CreateEnum
CREATE TYPE "TransferCategory" AS ENUM ('ACADEMY_TO_ACADEMY', 'CLUB_TO_CLUB', 'ACADEMY_TO_CLUB', 'CLUB_TO_ACADEMY', 'FREE_AGENT_TO_CLUB', 'FREE_AGENT_TO_ACADEMY');

-- CreateEnum
CREATE TYPE "AcademyTransferType" AS ENUM ('INTERNAL', 'EXTERNAL', 'NONE');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('FRIENDLY', 'LEAGUE', 'CUP', 'TOURNAMENT', 'TRIAL');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'POSTPONED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "GameReportPaymentStatus" AS ENUM ('PAID', 'UNPAID', 'DUE');

-- CreateEnum
CREATE TYPE "GameReportStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('PLAYER', 'CLUB', 'ACADEMY', 'AGENT', 'TEAM', 'COACH', 'POST', 'MATCH', 'TRANSFER', 'PRODUCT', 'SPONSOR');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('CLUB', 'ACADEMY', 'FREE_AGENT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TRANSFER_FEE', 'AGENT_COMMISSION', 'MATCH_COST', 'SPONSORSHIP', 'MEMBERSHIP_FEE', 'PRODUCT_SALE');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('GENERAL', 'IMAGE', 'VIDEO', 'ARTICLE');

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "countryFlag" TEXT,
    "city" TEXT,
    "coverPhoto" TEXT,
    "logo" TEXT,
    "dateOfEstablishment" TIMESTAMP(3),
    "secondaryEmail" TEXT,
    "secondaryPhone" TEXT,
    "website" TEXT,
    "description" TEXT,
    "visionAndMission" TEXT,
    "leagueId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_achievements" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "year" INTEGER,
    "championship" TEXT,
    "venue" TEXT,

    CONSTRAINT "club_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academies" (
    "id" TEXT NOT NULL,
    "clubId" TEXT,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "coverPhoto" TEXT,
    "nationality" TEXT,
    "nationalityFlag" TEXT,
    "dateOfEstablishment" TIMESTAMP(3),
    "city" TEXT,
    "secondaryEmail" TEXT,
    "secondaryPhone" TEXT,
    "website" TEXT,
    "description" TEXT,
    "visionAndMission" TEXT,
    "trainingPhilosophy" TEXT,
    "ageGroup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academy_managers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "academyId" TEXT NOT NULL,

    CONSTRAINT "academy_managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clubId" TEXT,
    "academyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agencyName" TEXT,
    "licenseNumber" TEXT,
    "experienceYears" INTEGER,
    "specialization" TEXT,
    "verificationStatus" "AgentVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "commissionRate" DOUBLE PRECISION DEFAULT 0,
    "clubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_earnings" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "transferId" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "userRole" "UserRole" NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "flag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "super_admins" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "adminRole" "AdminRole" NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "dob" TIMESTAMP(3),
    "age" INTEGER,
    "gender" TEXT,
    "nationality" TEXT,
    "nationalityFlag" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "location" TEXT,
    "websiteUrl" TEXT,
    "license" TEXT,
    "experienceYears" INTEGER,
    "specialization" TEXT,
    "keyAccomplishments" TEXT[],
    "totalMatches" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "currentValue" DOUBLE PRECISION,
    "salary" DOUBLE PRECISION,
    "tactics" INTEGER NOT NULL DEFAULT 0,
    "leadership" INTEGER NOT NULL DEFAULT 0,
    "discipline" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_managed_clubs" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "clubName" TEXT NOT NULL,
    "clubLogo" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "coach_managed_clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_trophies" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER,
    "image" TEXT,

    CONSTRAINT "coach_trophies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_courses" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT,
    "image" TEXT,

    CONSTRAINT "coach_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_formations" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "formation" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "coach_formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_testimonials" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorTitle" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "avatar" TEXT,

    CONSTRAINT "coach_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_docs" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "coach_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_players" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "coach_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_teams" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "coach_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "countryFlag" TEXT,
    "logo" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "academyId" TEXT,
    "clubId" TEXT,
    "leagueId" TEXT,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "matchType" "MatchType" NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "kickoffAt" TIMESTAMP(3) NOT NULL,
    "venueName" TEXT,
    "venueAddress" TEXT,
    "videoLink" TEXT,
    "galleryImages" TEXT[],
    "matchHighlights" TEXT[],
    "referees" TEXT,
    "additionalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_costs" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "transportation" DOUBLE PRECISION DEFAULT 0,
    "mealCost" DOUBLE PRECISION DEFAULT 0,
    "otherCost" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_reports" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "myTeamId" TEXT NOT NULL,
    "position" TEXT,
    "foot" TEXT,
    "characteristics" TEXT[],
    "weight" INTEGER,
    "height" INTEGER,
    "matchPlayed" INTEGER,
    "minutesPlayed" INTEGER,
    "manOfTheMatch" BOOLEAN DEFAULT false,
    "scoutName" TEXT,
    "gameType" TEXT,
    "game_date" TIMESTAMP(3),
    "location" TEXT,
    "match_result" TEXT,
    "weather" TEXT,
    "rating" DOUBLE PRECISION,
    "additionalNumber" INTEGER DEFAULT 0,
    "matchVideoLink" TEXT,
    "matchHighlightClip" TEXT,
    "matchImages" TEXT[],
    "isApproaved" BOOLEAN NOT NULL DEFAULT false,
    "status" "GameReportStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "GameReportPaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_statistics" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "match_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_media" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "caption" TEXT,

    CONSTRAINT "match_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extra_events" (
    "id" TEXT NOT NULL,
    "academyId" TEXT,
    "name" TEXT,
    "type" TEXT,
    "targetAttendees" TEXT,
    "date" TIMESTAMP(3),
    "startTime" TEXT,
    "endTime" TEXT,
    "registrationDeadline" TIMESTAMP(3),
    "venueName" TEXT,
    "fullAddress" TEXT,
    "maxCapacity" INTEGER,
    "eventFee" INTEGER,
    "description" TEXT,
    "requirements" TEXT,
    "contactPersonName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extra_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_sessions" (
    "id" TEXT NOT NULL,
    "sessionName" TEXT,
    "teamId" TEXT,
    "headCoachId" TEXT,
    "date" TIMESTAMP(3),
    "startTime" TEXT,
    "endTime" TEXT,
    "location" TEXT,
    "sessionType" TEXT,
    "focusArea" TEXT,
    "maxParticipants" INTEGER,
    "description" TEXT,
    "requiredEquip" TEXT,
    "additionalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_players" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "presentType" TEXT,

    CONSTRAINT "session_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_comments" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "comment" TEXT,
    "gameReportId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coach_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_players" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "relationship" TEXT,

    CONSTRAINT "parent_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "styleImage" TEXT,
    "playType" TEXT,
    "playerType" TEXT,
    "characteristics" TEXT,
    "academyId" TEXT,
    "clubId" TEXT,
    "agentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "birth_countries" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "birth_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dual_nationalities" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dual_nationalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physical_stats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "leftFootShot" DOUBLE PRECISION,
    "rightFootShot" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "physical_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fluency" "LanguageFluency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maps" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strengths" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "pace" INTEGER,
    "shooting" INTEGER,
    "passing" INTEGER,
    "dribbling" INTEGER,
    "defending" INTEGER,
    "physical" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strengths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_matrix" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "pace" INTEGER,
    "passAccuracy" INTEGER,
    "shootAccuracy" INTEGER,
    "dibbleSuccess" INTEGER,
    "tackleSuccess" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performance_matrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_values" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "fromDate" TIMESTAMP(3),
    "toDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_highlights" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season_stats" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "matches" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "isCurrentSeason" BOOLEAN NOT NULL DEFAULT true,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "season_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_attributes" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_skills" (
    "id" TEXT NOT NULL,
    "skillAttributeId" TEXT NOT NULL,
    "ballControll" INTEGER,
    "dribbling" INTEGER,
    "shortPassing" INTEGER,
    "longPassing" INTEGER,
    "crossing" INTEGER,
    "shooting" INTEGER,
    "finishing" INTEGER,
    "longShots" INTEGER,

    CONSTRAINT "technical_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tactical_skills" (
    "id" TEXT NOT NULL,
    "skillAttributeId" TEXT NOT NULL,
    "positioning" INTEGER,
    "vision" INTEGER,
    "anticipation" INTEGER,
    "composure" INTEGER,
    "teamWork" INTEGER,
    "workRate" INTEGER,
    "decisions" INTEGER,
    "concentration" INTEGER,

    CONSTRAINT "tactical_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physical_attributes" (
    "id" TEXT NOT NULL,
    "skillAttributeId" TEXT NOT NULL,
    "acceleration" INTEGER,
    "springSpeed" INTEGER,
    "stamina" INTEGER,
    "strength" INTEGER,
    "balance" INTEGER,
    "agility" INTEGER,
    "reactions" INTEGER,
    "jumping" INTEGER,

    CONSTRAINT "physical_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mental_skills" (
    "id" TEXT NOT NULL,
    "skillAttributeId" TEXT NOT NULL,
    "aggression" INTEGER,
    "interceptions" INTEGER,
    "attPosition" INTEGER,
    "leadership" INTEGER,
    "bravery" INTEGER,
    "determination" INTEGER,
    "flair" INTEGER,
    "influence" INTEGER,

    CONSTRAINT "mental_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_cvs" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "fullName" TEXT,
    "avatar" TEXT,
    "nationality" TEXT,
    "flagImage" TEXT,
    "dob" TIMESTAMP(3),
    "age" INTEGER,
    "gender" TEXT,
    "email" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "socialPortfolioLink" TEXT,
    "location" TEXT,
    "websiteUrl" TEXT,
    "languages" TEXT,
    "transferFee" TEXT,
    "releaseClause" TEXT,
    "salary" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "dominantFoot" TEXT,
    "alternateFootRate" INTEGER,
    "position" TEXT,
    "secondaryPositions" TEXT,
    "ballControl" INTEGER,
    "dribbling" INTEGER,
    "shortPassing" INTEGER,
    "longPassing" INTEGER,
    "crossing" INTEGER,
    "shooting" INTEGER,
    "finishing" INTEGER,
    "longShots" INTEGER,
    "positioning" INTEGER,
    "vision" INTEGER,
    "anticipation" INTEGER,
    "composure" INTEGER,
    "teamWork" INTEGER,
    "workRate" INTEGER,
    "decisions" INTEGER,
    "concentration" INTEGER,
    "acceleration" INTEGER,
    "sprintSpeed" INTEGER,
    "stamina" INTEGER,
    "strength" INTEGER,
    "balance" INTEGER,
    "agility" INTEGER,
    "reactions" INTEGER,
    "jumping" INTEGER,
    "aggression" INTEGER,
    "interceptions" INTEGER,
    "attPosition" INTEGER,
    "leadership" INTEGER,
    "bravery" INTEGER,
    "determination" INTEGER,
    "flair" INTEGER,
    "influence" INTEGER,
    "totalGamePlayed" INTEGER,
    "totalGoals" INTEGER,
    "totalAssists" INTEGER,
    "avgRating" DOUBLE PRECISION,
    "achievements" TEXT,
    "coachValidation" TEXT,
    "academyReference" TEXT,
    "footballAgentContract" TEXT,

    CONSTRAINT "player_cvs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detailed_analysis_metrixes" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detailed_analysis_metrixes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detailed_analysis_metrix_rows" (
    "id" TEXT NOT NULL,
    "metrixId" TEXT NOT NULL,
    "category" TEXT,
    "score" INTEGER,
    "trend" TEXT,
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detailed_analysis_metrix_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "success_stories" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "category" TEXT,
    "image" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "success_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_attribute_analyses" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "player_attribute_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_abilities" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "ballControl" INTEGER,
    "passing" INTEGER,
    "dribbling" INTEGER,
    "firstTouch" INTEGER,

    CONSTRAINT "technical_abilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reaction_skills" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "positioning" INTEGER,
    "vision" INTEGER,
    "decisionMaking" INTEGER,
    "teamWork" INTEGER,

    CONSTRAINT "reaction_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physical_attribute_models" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "speed" INTEGER,
    "stamina" INTEGER,
    "strength" INTEGER,
    "agility" INTEGER,

    CONSTRAINT "physical_attribute_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mental_strengths" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "composure" INTEGER,
    "determination" INTEGER,
    "leadership" INTEGER,
    "bravery" INTEGER,

    CONSTRAINT "mental_strengths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attacking_skills" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "shooting" INTEGER,
    "finishing" INTEGER,
    "longShots" INTEGER,
    "attPosition" INTEGER,

    CONSTRAINT "attacking_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defensive_skills" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "tackling" INTEGER,
    "interceptions" INTEGER,
    "marking" INTEGER,
    "heading" INTEGER,

    CONSTRAINT "defensive_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positional_coefficients" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "positional_coefficients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positional_coefficient_rows" (
    "id" TEXT NOT NULL,
    "coefficientId" TEXT NOT NULL,
    "title" TEXT,
    "score" INTEGER,
    "grade" TEXT,

    CONSTRAINT "positional_coefficient_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "duration" TEXT,
    "status" TEXT,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPersonName" TEXT,
    "contactPersonEmail" TEXT,
    "contactPersonPhone" TEXT,
    "contactPersonAddress" TEXT,
    "sponsorType" TEXT,
    "status" TEXT,
    "contractValue" DOUBLE PRECISION,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "description" TEXT,
    "benefitsOrDeliverables" TEXT,
    "academyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "sku" TEXT,
    "regularPrice" DOUBLE PRECISION,
    "salePrice" DOUBLE PRECISION,
    "description" TEXT,
    "availableSize" TEXT,
    "availableColors" TEXT,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "minStockLevel" INTEGER NOT NULL DEFAULT 0,
    "maxOrderQuantity" INTEGER,
    "productImage" TEXT,
    "status" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "academyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT,
    "type" "PostType" NOT NULL DEFAULT 'GENERAL',
    "playerId" TEXT,
    "academyId" TEXT,
    "clubId" TEXT,
    "coachId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_posts" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "image_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_posts" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "video_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "summary" TEXT,
    "academyId" TEXT,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "agentId" TEXT,
    "sourceClubId" TEXT,
    "sourceAcademyId" TEXT,
    "destClubId" TEXT,
    "destAcademyId" TEXT,
    "transferFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "TransferStatus" NOT NULL DEFAULT 'PENDING',
    "category" "TransferCategory" NOT NULL,
    "academyTransferType" "AcademyTransferType" NOT NULL DEFAULT 'NONE',
    "initiatorType" "InitiatorType" NOT NULL,
    "negotiationTerms" TEXT,
    "agreementDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayerToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PlayerToTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "clubs_userId_key" ON "clubs"("userId");

-- CreateIndex
CREATE INDEX "clubs_leagueId_idx" ON "clubs"("leagueId");

-- CreateIndex
CREATE INDEX "club_achievements_clubId_idx" ON "club_achievements"("clubId");

-- CreateIndex
CREATE INDEX "academies_clubId_idx" ON "academies"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "academy_managers_userId_key" ON "academy_managers"("userId");

-- CreateIndex
CREATE INDEX "academy_managers_academyId_idx" ON "academy_managers"("academyId");

-- CreateIndex
CREATE INDEX "teams_clubId_idx" ON "teams"("clubId");

-- CreateIndex
CREATE INDEX "teams_academyId_idx" ON "teams"("academyId");

-- CreateIndex
CREATE UNIQUE INDEX "agents_userId_key" ON "agents"("userId");

-- CreateIndex
CREATE INDEX "agents_clubId_idx" ON "agents"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "agent_earnings_transferId_key" ON "agent_earnings"("transferId");

-- CreateIndex
CREATE INDEX "agent_earnings_agentId_idx" ON "agent_earnings"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_email_key" ON "super_admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coaches_userId_key" ON "coaches"("userId");

-- CreateIndex
CREATE INDEX "coach_managed_clubs_coachId_idx" ON "coach_managed_clubs"("coachId");

-- CreateIndex
CREATE INDEX "coach_trophies_coachId_idx" ON "coach_trophies"("coachId");

-- CreateIndex
CREATE INDEX "coach_courses_coachId_idx" ON "coach_courses"("coachId");

-- CreateIndex
CREATE INDEX "coach_formations_coachId_idx" ON "coach_formations"("coachId");

-- CreateIndex
CREATE INDEX "coach_testimonials_coachId_idx" ON "coach_testimonials"("coachId");

-- CreateIndex
CREATE INDEX "coach_docs_coachId_idx" ON "coach_docs"("coachId");

-- CreateIndex
CREATE INDEX "coach_players_coachId_idx" ON "coach_players"("coachId");

-- CreateIndex
CREATE INDEX "coach_players_playerId_idx" ON "coach_players"("playerId");

-- CreateIndex
CREATE INDEX "coach_teams_coachId_idx" ON "coach_teams"("coachId");

-- CreateIndex
CREATE INDEX "coach_teams_teamId_idx" ON "coach_teams"("teamId");

-- CreateIndex
CREATE INDEX "matches_academyId_idx" ON "matches"("academyId");

-- CreateIndex
CREATE INDEX "matches_leagueId_idx" ON "matches"("leagueId");

-- CreateIndex
CREATE INDEX "matches_homeTeamId_idx" ON "matches"("homeTeamId");

-- CreateIndex
CREATE INDEX "matches_awayTeamId_idx" ON "matches"("awayTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "match_costs_matchId_key" ON "match_costs"("matchId");

-- CreateIndex
CREATE INDEX "match_costs_matchId_idx" ON "match_costs"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "game_reports_matchId_key" ON "game_reports"("matchId");

-- CreateIndex
CREATE INDEX "game_reports_playerId_idx" ON "game_reports"("playerId");

-- CreateIndex
CREATE INDEX "match_statistics_matchId_idx" ON "match_statistics"("matchId");

-- CreateIndex
CREATE INDEX "match_media_matchId_idx" ON "match_media"("matchId");

-- CreateIndex
CREATE INDEX "extra_events_academyId_idx" ON "extra_events"("academyId");

-- CreateIndex
CREATE INDEX "training_sessions_teamId_idx" ON "training_sessions"("teamId");

-- CreateIndex
CREATE INDEX "training_sessions_headCoachId_idx" ON "training_sessions"("headCoachId");

-- CreateIndex
CREATE INDEX "session_players_sessionId_idx" ON "session_players"("sessionId");

-- CreateIndex
CREATE INDEX "session_players_playerId_idx" ON "session_players"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "coach_comments_gameReportId_key" ON "coach_comments"("gameReportId");

-- CreateIndex
CREATE INDEX "coach_comments_coachId_idx" ON "coach_comments"("coachId");

-- CreateIndex
CREATE INDEX "coach_comments_playerId_idx" ON "coach_comments"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_key" ON "parents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "parents_addressId_key" ON "parents"("addressId");

-- CreateIndex
CREATE INDEX "parents_addressId_idx" ON "parents"("addressId");

-- CreateIndex
CREATE INDEX "parent_players_parentId_idx" ON "parent_players"("parentId");

-- CreateIndex
CREATE INDEX "parent_players_playerId_idx" ON "parent_players"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "players_userId_key" ON "players"("userId");

-- CreateIndex
CREATE INDEX "players_academyId_idx" ON "players"("academyId");

-- CreateIndex
CREATE INDEX "players_clubId_idx" ON "players"("clubId");

-- CreateIndex
CREATE INDEX "players_agentId_idx" ON "players"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "birth_countries_playerId_key" ON "birth_countries"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "dual_nationalities_playerId_key" ON "dual_nationalities"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_playerId_key" ON "contacts"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "physical_stats_playerId_key" ON "physical_stats"("playerId");

-- CreateIndex
CREATE INDEX "languages_playerId_idx" ON "languages"("playerId");

-- CreateIndex
CREATE INDEX "maps_playerId_idx" ON "maps"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "strengths_playerId_key" ON "strengths"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "performance_matrix_playerId_key" ON "performance_matrix"("playerId");

-- CreateIndex
CREATE INDEX "market_values_playerId_idx" ON "market_values"("playerId");

-- CreateIndex
CREATE INDEX "career_highlights_playerId_idx" ON "career_highlights"("playerId");

-- CreateIndex
CREATE INDEX "career_highlights_teamId_idx" ON "career_highlights"("teamId");

-- CreateIndex
CREATE INDEX "season_stats_playerId_idx" ON "season_stats"("playerId");

-- CreateIndex
CREATE INDEX "skill_attributes_playerId_idx" ON "skill_attributes"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "technical_skills_skillAttributeId_key" ON "technical_skills"("skillAttributeId");

-- CreateIndex
CREATE UNIQUE INDEX "tactical_skills_skillAttributeId_key" ON "tactical_skills"("skillAttributeId");

-- CreateIndex
CREATE UNIQUE INDEX "physical_attributes_skillAttributeId_key" ON "physical_attributes"("skillAttributeId");

-- CreateIndex
CREATE UNIQUE INDEX "mental_skills_skillAttributeId_key" ON "mental_skills"("skillAttributeId");

-- CreateIndex
CREATE UNIQUE INDEX "player_cvs_playerId_key" ON "player_cvs"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "detailed_analysis_metrixes_playerId_key" ON "detailed_analysis_metrixes"("playerId");

-- CreateIndex
CREATE INDEX "detailed_analysis_metrix_rows_metrixId_idx" ON "detailed_analysis_metrix_rows"("metrixId");

-- CreateIndex
CREATE INDEX "success_stories_playerId_idx" ON "success_stories"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "player_attribute_analyses_playerId_key" ON "player_attribute_analyses"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "technical_abilities_analysisId_key" ON "technical_abilities"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "reaction_skills_analysisId_key" ON "reaction_skills"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "physical_attribute_models_analysisId_key" ON "physical_attribute_models"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "mental_strengths_analysisId_key" ON "mental_strengths"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "attacking_skills_analysisId_key" ON "attacking_skills"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "defensive_skills_analysisId_key" ON "defensive_skills"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "positional_coefficients_playerId_key" ON "positional_coefficients"("playerId");

-- CreateIndex
CREATE INDEX "positional_coefficient_rows_coefficientId_idx" ON "positional_coefficient_rows"("coefficientId");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "posts_userId_idx" ON "posts"("userId");

-- CreateIndex
CREATE INDEX "posts_playerId_idx" ON "posts"("playerId");

-- CreateIndex
CREATE INDEX "posts_academyId_idx" ON "posts"("academyId");

-- CreateIndex
CREATE INDEX "posts_clubId_idx" ON "posts"("clubId");

-- CreateIndex
CREATE INDEX "posts_coachId_idx" ON "posts"("coachId");

-- CreateIndex
CREATE INDEX "image_posts_postId_idx" ON "image_posts"("postId");

-- CreateIndex
CREATE INDEX "video_posts_postId_idx" ON "video_posts"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "articles_postId_key" ON "articles"("postId");

-- CreateIndex
CREATE INDEX "articles_academyId_idx" ON "articles"("academyId");

-- CreateIndex
CREATE INDEX "likes_userId_idx" ON "likes"("userId");

-- CreateIndex
CREATE INDEX "likes_postId_idx" ON "likes"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_postId_key" ON "likes"("userId", "postId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "comments_postId_idx" ON "comments"("postId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");

-- CreateIndex
CREATE INDEX "transfers_playerId_idx" ON "transfers"("playerId");

-- CreateIndex
CREATE INDEX "transfers_agentId_idx" ON "transfers"("agentId");

-- CreateIndex
CREATE INDEX "transfers_sourceClubId_idx" ON "transfers"("sourceClubId");

-- CreateIndex
CREATE INDEX "transfers_sourceAcademyId_idx" ON "transfers"("sourceAcademyId");

-- CreateIndex
CREATE INDEX "transfers_destClubId_idx" ON "transfers"("destClubId");

-- CreateIndex
CREATE INDEX "transfers_destAcademyId_idx" ON "transfers"("destAcademyId");

-- CreateIndex
CREATE INDEX "transfers_status_idx" ON "transfers"("status");

-- CreateIndex
CREATE INDEX "transfers_category_idx" ON "transfers"("category");

-- CreateIndex
CREATE INDEX "_PlayerToTeam_B_index" ON "_PlayerToTeam"("B");

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_achievements" ADD CONSTRAINT "club_achievements_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academies" ADD CONSTRAINT "academies_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_managers" ADD CONSTRAINT "academy_managers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academy_managers" ADD CONSTRAINT "academy_managers_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_earnings" ADD CONSTRAINT "agent_earnings_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_managed_clubs" ADD CONSTRAINT "coach_managed_clubs_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_trophies" ADD CONSTRAINT "coach_trophies_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_courses" ADD CONSTRAINT "coach_courses_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_formations" ADD CONSTRAINT "coach_formations_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_testimonials" ADD CONSTRAINT "coach_testimonials_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_docs" ADD CONSTRAINT "coach_docs_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_players" ADD CONSTRAINT "coach_players_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_players" ADD CONSTRAINT "coach_players_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_teams" ADD CONSTRAINT "coach_teams_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_teams" ADD CONSTRAINT "coach_teams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_costs" ADD CONSTRAINT "match_costs_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_reports" ADD CONSTRAINT "game_reports_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_reports" ADD CONSTRAINT "game_reports_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_reports" ADD CONSTRAINT "game_reports_myTeamId_fkey" FOREIGN KEY ("myTeamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_statistics" ADD CONSTRAINT "match_statistics_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_media" ADD CONSTRAINT "match_media_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extra_events" ADD CONSTRAINT "extra_events_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_headCoachId_fkey" FOREIGN KEY ("headCoachId") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "training_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_comments" ADD CONSTRAINT "coach_comments_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_comments" ADD CONSTRAINT "coach_comments_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_comments" ADD CONSTRAINT "coach_comments_gameReportId_fkey" FOREIGN KEY ("gameReportId") REFERENCES "game_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_players" ADD CONSTRAINT "parent_players_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_players" ADD CONSTRAINT "parent_players_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "birth_countries" ADD CONSTRAINT "birth_countries_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dual_nationalities" ADD CONSTRAINT "dual_nationalities_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_stats" ADD CONSTRAINT "physical_stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "languages" ADD CONSTRAINT "languages_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maps" ADD CONSTRAINT "maps_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "strengths" ADD CONSTRAINT "strengths_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_matrix" ADD CONSTRAINT "performance_matrix_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_values" ADD CONSTRAINT "market_values_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_highlights" ADD CONSTRAINT "career_highlights_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_highlights" ADD CONSTRAINT "career_highlights_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season_stats" ADD CONSTRAINT "season_stats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_attributes" ADD CONSTRAINT "skill_attributes_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_skills" ADD CONSTRAINT "technical_skills_skillAttributeId_fkey" FOREIGN KEY ("skillAttributeId") REFERENCES "skill_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tactical_skills" ADD CONSTRAINT "tactical_skills_skillAttributeId_fkey" FOREIGN KEY ("skillAttributeId") REFERENCES "skill_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_attributes" ADD CONSTRAINT "physical_attributes_skillAttributeId_fkey" FOREIGN KEY ("skillAttributeId") REFERENCES "skill_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mental_skills" ADD CONSTRAINT "mental_skills_skillAttributeId_fkey" FOREIGN KEY ("skillAttributeId") REFERENCES "skill_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_cvs" ADD CONSTRAINT "player_cvs_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailed_analysis_metrixes" ADD CONSTRAINT "detailed_analysis_metrixes_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailed_analysis_metrix_rows" ADD CONSTRAINT "detailed_analysis_metrix_rows_metrixId_fkey" FOREIGN KEY ("metrixId") REFERENCES "detailed_analysis_metrixes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "success_stories" ADD CONSTRAINT "success_stories_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_attribute_analyses" ADD CONSTRAINT "player_attribute_analyses_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_abilities" ADD CONSTRAINT "technical_abilities_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "player_attribute_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reaction_skills" ADD CONSTRAINT "reaction_skills_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "player_attribute_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physical_attribute_models" ADD CONSTRAINT "physical_attribute_models_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "player_attribute_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mental_strengths" ADD CONSTRAINT "mental_strengths_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "player_attribute_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attacking_skills" ADD CONSTRAINT "attacking_skills_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "player_attribute_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defensive_skills" ADD CONSTRAINT "defensive_skills_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "player_attribute_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positional_coefficients" ADD CONSTRAINT "positional_coefficients_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positional_coefficient_rows" ADD CONSTRAINT "positional_coefficient_rows_coefficientId_fkey" FOREIGN KEY ("coefficientId") REFERENCES "positional_coefficients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_posts" ADD CONSTRAINT "image_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_posts" ADD CONSTRAINT "video_posts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_academyId_fkey" FOREIGN KEY ("academyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_sourceClubId_fkey" FOREIGN KEY ("sourceClubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_sourceAcademyId_fkey" FOREIGN KEY ("sourceAcademyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_destClubId_fkey" FOREIGN KEY ("destClubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_destAcademyId_fkey" FOREIGN KEY ("destAcademyId") REFERENCES "academies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToTeam" ADD CONSTRAINT "_PlayerToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToTeam" ADD CONSTRAINT "_PlayerToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
