import { Post, PostStatus, Prisma } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};

const getAllPost = async (payload: {
  search?: string | undefined;
  tags?: string[] | [];
  isFeatured?: boolean | undefined;
  status: PostStatus | undefined;
  authorId?: string | undefined;
  page: number;
  limit: number;
  skip?: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const {
    search,
    tags,
    isFeatured,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  } = payload;

  const andConditions: Prisma.PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags && tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured: isFeatured,
    });
  }

  if (status) {
    andConditions.push({
      status: status,
    });
  }

  if (authorId) {
    andConditions.push({
      authorId: authorId,
    });
  }

  const allPosts = await prisma.post.findMany({
    take: limit,
    skip,
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalPosts = await prisma.post.count({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
  });

  return {
    data: allPosts,
    pagination: {
      totalPosts,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
    },
  };
};

const getPostId = async () => {
  console.log("Get Post Id is created...");
};

export const postService = {
  createPost,
  getAllPost,
  getPostId
};
