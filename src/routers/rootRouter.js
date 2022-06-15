import express from "express";
import {
  joinGet,
  joinPost,
  loginGet,
  loginPost,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(joinGet).post(joinPost);
rootRouter.route("/login").get(loginGet).post(loginPost);
rootRouter.get("/search", search);

export default rootRouter;
