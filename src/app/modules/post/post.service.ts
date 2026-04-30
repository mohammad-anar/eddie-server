import { Post, Prisma, Like, Comment } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper.js";
import { prisma } from "../../../helpers/prisma.js";
import { IPaginationOptions } from "../../../types/pagination.js";
import { IGenericResponse } from "../../../types/common.js";
import { postSearchableFields } from "./post.constant.js";
import { IPostFilterRequest } from "./post.interface.js";

const createPost = async (data: any): Promise<Post> => {
  const { images, videos, article, ...postData } = data;

  const result = await prisma.post.create({
    data: {
      ...postData,
      images: images ? { create: images.map((url: string) => ({ url })) } : undefined,
      videos: videos ? { create: videos.map((url: string) => ({ url })) } : undefined,
      article: article ? { create: article } : undefined,
    },
    include: {
      user: true,
      images: true,
      videos: true,
      article: true,
    },
  });
  return result;
};

const getAllPosts = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Post[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: postSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.PostWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.post.findMany({
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
      user: true,
      images: true,
      videos: true,
      article: true,
      likes: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
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

const getSinglePost = async (id: string): Promise<Post | null> => {
  const result = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      images: true,
      videos: true,
      article: true,
      likes: {
        include: {
          user: true,
        },
      },
      comments: {
        where: {
          parentId: null,
        },
        include: {
          user: true,
          replies: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const updatePost = async (
  id: string,
  payload: any
): Promise<Post | null> => {
  const { images, videos, article, ...postData } = payload;

  const result = await prisma.post.update({
    where: {
      id,
    },
    data: {
      ...postData,
      images: images
        ? {
            deleteMany: {},
            create: images.map((url: string) => ({ url })),
          }
        : undefined,
      videos: videos
        ? {
            deleteMany: {},
            create: videos.map((url: string) => ({ url })),
          }
        : undefined,
      article: article
        ? {
            upsert: {
              create: article,
              update: article,
            },
          }
        : undefined,
    },
    include: {
      user: true,
      images: true,
      videos: true,
      article: true,
    },
  });
  return result;
};

const deletePost = async (id: string): Promise<Post | null> => {
  const result = await prisma.post.delete({
    where: {
      id,
    },
  });
  return result;
};

const toggleLike = async (userId: string, postId: string): Promise<Like | null> => {
  const isLiked = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (isLiked) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return null;
  } else {
    const result = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
    return result;
  }
};

const createComment = async (data: Comment): Promise<Comment> => {
  const result = await prisma.comment.create({
    data,
    include: {
      user: true,
    },
  });
  return result;
};

export const PostService = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  toggleLike,
  createComment,
};
