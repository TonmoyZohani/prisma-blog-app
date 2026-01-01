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

export const postController = {
  createPost,
};

// const createPost = async (req: Request, res: Response) => {
//   const user = req.user;

//   if (!user) {
//     res.status(401).json({ message: "Unauthorized" });
//     return;
//   }

//   try {
//     const result = await postService.createPost(req.body, user?.id as string);
//     res.status(201).json(result);
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const postController = {
//   createPost,
// };
