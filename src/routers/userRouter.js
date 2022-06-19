import express from "express";
import {
  startGithubLogin,
  finishGithubLogin,
  logout,
  userProfile,
  editUserGet,
  editUserPost,
  changePasswordGet,
  changePasswordPost,
  deleteUser,
} from "../controllers/userController";

import {
  protectMiddleware,
  publicOnlyMiddleware,
  uploadAvatar,
} from "../middleware";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
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
userRouter.get("/:id", userProfile);

export default userRouter;
