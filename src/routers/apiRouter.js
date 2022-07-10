import express from "express";
import { registerView } from "../controllers/videoController";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.put("/videos/:id([0-9a-f]{24})/comment", updateComment);
apiRouter.delete("/videos/:id([0-9a-f]{24})/comment", deleteComment);
export default apiRouter;
