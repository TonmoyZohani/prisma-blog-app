import { Post, Prisma } from "../../../generated/prisma/client";
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
}) => {
  const { search, tags } = payload;

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

  return prisma.post.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
  });
};

export const postService = {
  createPost,
  getAllPost,
};
