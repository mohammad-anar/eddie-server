import { Request, Response } from "express";
import httpStatus from "http-status";
import { PostService } from "./post.service.js";
import pick from "../../../helpers/pick.js";
import { postFilterableFields, paginationFields } from "./post.constant.js";
import catchAsync from "app/shared/catchAsync.js";
import sendResponse from "app/shared/sendResponse.js";
import { getMultipleFilesPath } from "../../shared/getFilePath.js";

const createPost = catchAsync(async (req: Request, res: Response) => {
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.images = getMultipleFilesPath(req.files, "images");
    req.body.data.videos = getMultipleFilesPath(req.files, "videos");
  }
  const result = await PostService.createPost(req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await PostService.getAllPosts(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PostService.getSinglePost(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post retrieved successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.files) {
    req.body.data = JSON.parse(req.body.data);
    req.body.data.images = getMultipleFilesPath(req.files, "images");
    req.body.data.videos = getMultipleFilesPath(req.files, "videos");
  }
  const result = await PostService.updatePost(id as string, req.body.data || req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PostService.deletePost(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post deleted successfully",
    data: result,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = (req.user as any).id;
  const result = await PostService.toggleLike(userId, postId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result ? "Post liked" : "Post unliked",
    data: result,
  });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.createComment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

export const PostController = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLike,
  createComment,
};
