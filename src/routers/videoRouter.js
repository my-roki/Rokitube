import express from "express";
import {
  watchVideo,
  uploadVideoGet,
  uploadVideoPost,
  editVideoGet,
  editVideoPost,
  deleteVideo,
} from "../controllers/videoController";
import { protectMiddleware } from "../middleware";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watchVideo);
videoRouter
  .route("/upload")
  .all(protectMiddleware)
  .get(uploadVideoGet)
  .post(uploadVideoPost);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectMiddleware)
  .get(editVideoGet)
  .post(editVideoPost);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectMiddleware)
  .get(deleteVideo);

export default videoRouter;
