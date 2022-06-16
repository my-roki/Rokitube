import Video from "../models/Videos";

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
  let videos = await Video.find({}).sort({ createdAt: "desc" });
  videos = getVideoCreatedAtFromNow(videos);
  return res.status(200).render("home", { pageTitle: "Home", videos });
}

export async function search(req, res) {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: { $regex: new RegExp(keyword, "i") },
    });
    videos = getVideoCreatedAtFromNow(videos);
  }
  return res.status(200).render("search", { pageTitle: "Search", videos });
}

export async function watchVideo(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not found" });
  }
  return res.status(200).render("watch", {
    pageTitle: video.title,
    video,
  });
}

export function uploadVideoGet(req, res) {
  return res.status(200).render("upload", { pageTitle: `Upload Video` });
}

export async function uploadVideoPost(req, res) {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title: title,
      description: description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.status(200).redirect("/");
  } catch (err) {
    return res.status(400).render("upload", {
      pageTitle: `Upload Video`,

      errMessage: err._message,
    });
  }
}

export async function editVideoGet(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Video not found" });
  }
  res.status(200).render("edit", { pageTitle: `Edit ${video.title}`, video });
}

export async function editVideoPost(req, res) {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
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
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.status(200).redirect("/");
}
