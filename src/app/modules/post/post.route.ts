import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import auth from "../../middlewares/auth.js";
import { AdminRole, UserRole } from "@prisma/client";
import { PostController } from "./post.controller.js";
import { PostValidation } from "./post.validation.js";
import fileUploadHandler from "../../middlewares/fileUploadHandler.js";

const router = express.Router();

router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getSinglePost);

router.post(
  "/",
  auth(AdminRole.SUPER_ADMIN, UserRole.PLAYER, UserRole.ACADEMY, UserRole.COACH, UserRole.PROFESSIONAL_CLUB),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(PostValidation.createPostZodSchema),
  PostController.createPost
);

router.patch(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PLAYER, UserRole.ACADEMY, UserRole.COACH, UserRole.PROFESSIONAL_CLUB),
  fileUploadHandler(),
  (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(PostValidation.updatePostZodSchema),
  PostController.updatePost
);

router.delete(
  "/:id",
  auth(AdminRole.SUPER_ADMIN, UserRole.PLAYER, UserRole.ACADEMY, UserRole.COACH, UserRole.PROFESSIONAL_CLUB),
  PostController.deletePost
);

router.post(
  "/:postId/like",
  auth(AdminRole.SUPER_ADMIN, UserRole.PLAYER, UserRole.ACADEMY, UserRole.COACH, UserRole.PROFESSIONAL_CLUB),
  PostController.toggleLike
);

router.post(
  "/comments",
  auth(AdminRole.SUPER_ADMIN, UserRole.PLAYER, UserRole.ACADEMY, UserRole.COACH, UserRole.PROFESSIONAL_CLUB),
  validateRequest(PostValidation.createCommentZodSchema),
  PostController.createComment
);

export const PostRoutes = router;
