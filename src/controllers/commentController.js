import Comment from "../models/Comment";
import Video from "../models/Video";
import User from "../models/User";

export async function createComment(req, res) {
  const {
    body: { text },
    params: { id },
    session: { loginUser },
  } = req;

  const user = await User.findById(loginUser._id);
  const video = await Video.findById(id);
  if (!video && !user) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: loginUser._id,
    video: id,
  });
  user.comments.push(comment._id);
  video.comments.push(comment._id);
  user.save();
  video.save();

  const { username, avatar } = user;
  const { _id, createdAt } = comment;

  return res.status(201).json({
    newCommentId: _id,
    newUsername: username,
    newAvatar: avatar,
    newCreatedAt: createdAt,
  });
}

export async function updateComment(req, res) {
  const {
    body: { text, commentId },
    session: {
      loginUser: { _id },
    },
  } = req;
  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(comment.owner) !== _id) {
    res.sendStatus(401);
  }
  await Comment.findByIdAndUpdate(commentId, { text });
  return res.sendStatus(200);
}

export async function deleteComment(req, res) {
  const {
    params: { id },
    session: {
      loginUser: { _id },
    },
  } = req;
  const comment = await Comment.findById(id);

  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(comment.owner) !== _id) {
    res.sendStatus(401);
  }
  await Comment.findByIdAndDelete(id);

  const user = await User.findById(_id);
  const video = await Video.findById(String(comment.video));
  user.comments.splice(user.comments.indexOf(comment._id), 1);
  video.comments.splice(video.comments.indexOf(comment._id), 1);
  await user.save();
  await video.save();

  res.sendStatus(200);
}
