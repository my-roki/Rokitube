import express from "express";
import {
  startGithubLogin,
  finishGithubLogin,
  logout,
  userProfile,
  editUser,
  deleteUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/:id", userProfile);

export default userRouter;
