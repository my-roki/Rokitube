import Video from "../models/Video";
import User from "../models/User";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const getVideoCreatedAtFromNow = (videos) => {
  videos.forEach((video) => {
    const fancy = dayjs(video.createdAt).fromNow();
    video.createdAtFromNow = fancy;
  });
  return videos;
};

export async function home(req, res) {
  let videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  videos = getVideoCreatedAtFromNow(videos);
  return res.status(200).render("home", { pageTitle: "Home", videos });
}

export async function search(req, res) {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: { $regex: new RegExp(keyword, "i") },
    }).populate("owner");
    videos = getVideoCreatedAtFromNow(videos);
  }
  return res.render("video/search", { pageTitle: "Search", videos });
}

export async function watchVideo(req, res) {
  let videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  videos = getVideoCreatedAtFromNow(videos);
  videos = videos.sort(() => Math.random() - 0.5);
  if (videos.length > 10) {
    videos = videos.slice(0, 10);
  }
  const { id } = req.params;
  let video = await Video.findById(id)
    .populate("owner")
    .populate({ path: "comments", populate: { path: "owner" } });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not found" });
  }
  video.comments = getVideoCreatedAtFromNow(video.comments);
  return res.status(200).render("video/watch", {
    pageTitle: video.title,
    video,
    videos,
  });
}

export function uploadVideoGet(req, res) {
  return res.status(200).render("video/upload", { pageTitle: `Upload Video` });
}

export async function uploadVideoPost(req, res) {
  const {
    files: { video, thumbnail },
    body: { title, description, hashtags },
    session: {
      loginUser: { _id },
    },
  } = req;

  const isProd = process.env.NODE_ENV;
  try {
    const newVideo = await Video.create({
      videoUrl: Video.formatFileDestination(
        isProd ? video[0].location : video[0].path
      ),
      thumbnailUrl: Video.formatFileDestination(
        isProd ? thumbnail[0].location : thumbnail[0].path
      ),
      title,
      description,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });

    let user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.status(200).redirect("/");
  } catch (err) {
    return res.status(400).render("video/upload", {
      pageTitle: `Upload Video`,

      errMessage: err._message,
    });
  }
}

export async function editVideoGet(req, res) {
  const {
    params: { id },
    session: {
      loginUser: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not found" });
  }
  if (String(_id) !== String(video.owner)) {
    req.flash("error", "Not Authorized");
    return res.status(403).redirect("/");
  }
  return res.render("video/edit-video", {
    pageTitle: `Edit ${video.title}`,
    video,
  });
}

export async function editVideoPost(req, res) {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      loginUser: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(_id) !== String(video.owner)) {
    req.flash("error", "Not Authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title: title,
    description: description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.status(200).redirect(`/videos/${id}`);
}

// TODO: Confirm message modal should exist before delete video
export async function deleteVideo(req, res) {
  const {
    params: { id },
    session: {
      loginUser: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  const user = await User.findById(video.owner);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not found" });
  }
  if (String(_id) !== String(video.owner)) {
    req.flash("error", "Not Authorized");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  req.flash("info", "Delete Successfully");
  return res.status(200).redirect("/");
}

export async function registerView(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
}
