import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post, PostStatus } from "../../../generated/prisma/client";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(
      req.body,
      req?.user?.id as string
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : undefined;
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const result = await postService.getAllPost({
      search,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
    });

    console.log(authorId);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
