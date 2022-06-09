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

videoRouter.get("/:id(\\d+)", watchVideo);
videoRouter.route("/upload").get(uploadVideoGet).post(uploadVideoPost);
videoRouter.route("/:id(\\d+)/edit").get(editVideoGet).post(editVideoPost);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
