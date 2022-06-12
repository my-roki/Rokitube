import express from "express";
import {
  watchVideo,
  uploadVideoGet,
  uploadVideoPost,
  editVideoGet,
  editVideoPost,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watchVideo);
videoRouter.route("/upload").get(uploadVideoGet).post(uploadVideoPost);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(editVideoGet)
  .post(editVideoPost);
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);

export default videoRouter;
