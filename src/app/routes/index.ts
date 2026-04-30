import express from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { UserRoutes } from "../modules/user/user.route.js";
import { ClubRoutes } from "../modules/club/club.route.js";
import { AcademyRoutes } from "../modules/academy/academy.route.js";
import { TeamRoutes } from "../modules/team/team.route.js";
import { CoachRoutes } from "../modules/coach/coach.route.js";
import { ParentRoutes } from "../modules/parent/parent.route.js";
import { PlayerRoutes } from "../modules/player/player.route.js";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
