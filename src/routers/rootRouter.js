import express from "express";
import {
  joinGet,
  joinPost,
  loginGet,
  loginPost,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { protectMiddleware, publicOnlyMiddleware } from "../middleware";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(joinGet).post(joinPost);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(loginGet)
  .post(loginPost);
rootRouter.get("/search", search);

export default rootRouter;
