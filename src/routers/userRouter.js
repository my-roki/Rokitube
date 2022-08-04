import express from "express";
import {
  logout,
  userProfile,
  editUserGet,
  editUserPost,
  changePasswordGet,
  changePasswordPost,
  deleteUser,
} from "../controllers/userController";

import {
  startGithubLogin,
  finishGithubLogin,
  startGoogleLogin,
  finishGoogleLogin,
} from "../controllers/authController";

import {
  protectMiddleware,
  publicOnlyMiddleware,
  uploadAvatar,
} from "../middleware";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/google/start", publicOnlyMiddleware, startGoogleLogin);
userRouter.get("/google/finish", publicOnlyMiddleware, finishGoogleLogin);
userRouter.get("/logout", protectMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(editUserGet)
  .post(uploadAvatar.single("avatar"), editUserPost);
userRouter
  .route("/change-password")
  .all(protectMiddleware)
  .get(changePasswordGet)
  .post(changePasswordPost);
userRouter.get("/delete", deleteUser);
userRouter.get("/:id([0-9a-f]{24})", userProfile);

export default userRouter;
