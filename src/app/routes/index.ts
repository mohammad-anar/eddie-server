import express from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { UserRoutes } from "../modules/user/user.route.js";
import { ClubRoutes } from "../modules/club/club.route.js";
import { AcademyRoutes } from "../modules/academy/academy.route.js";
import { TeamRoutes } from "../modules/team/team.route.js";
import { CoachRoutes } from "../modules/coach/coach.route.js";
import { ParentRoutes } from "../modules/parent/parent.route.js";
import { PlayerRoutes } from "../modules/player/player.route.js";
import { LeagueRoutes } from "../modules/league/league.route.js";
import { MatchRoutes } from "../modules/match/match.route.js";
import { SubscriptionPlanRoutes } from "../modules/subscriptionPlan/subscriptionPlan.route.js";
import { SponsorRoutes } from "../modules/sponsor/sponsor.route.js";
import { ProductRoutes } from "../modules/product/product.route.js";
import { PostRoutes } from "../modules/post/post.route.js";
import { TransferRoutes } from "../modules/transfer/transfer.route.js";

const router = express.Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRouter },
  { path: "/users", route: UserRoutes },
  { path: "/clubs", route: ClubRoutes },
  { path: "/academies", route: AcademyRoutes },
  { path: "/teams", route: TeamRoutes },
  { path: "/coaches", route: CoachRoutes },
  { path: "/parents", route: ParentRoutes },
  { path: "/players", route: PlayerRoutes },
  { path: "/leagues", route: LeagueRoutes },
  { path: "/matches", route: MatchRoutes },
  { path: "/subscription-plans", route: SubscriptionPlanRoutes },
  { path: "/sponsors", route: SponsorRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/posts", route: PostRoutes },
  { path: "/transfers", route: TransferRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
