import express, { Request, Response, NextFunction, Router } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";

const router = express.Router();

const auth = (...roles: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    console.log(session);
    next();
  };
};

router.post("/", auth("USER"), postController.createPost);

export const postRouter: Router = router;
