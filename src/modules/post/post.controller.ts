import { Request, Response } from "express";
import { postService } from "./post.service";

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

    const result = await postService.getAllPost({ search, tags });

    console.log(search);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
