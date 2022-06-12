import Video from "../models/Videos";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const fakeUser = {
  username: "roki",
  isLogin: true,
};

// TODO: fix posted using dayjs fancy(ex. 10 minute ago)
dayjs.extend(relativeTime);
export async function home(req, res) {
  let videos = await Video.find({});
  videos.forEach((video) => {
    video.createdAt = dayjs(video.createdAt).fromNow();
    console.log(video.createdAt);
  });
  console.log(videos);
  return res.render("home", { pageTitle: "Home", fakeUser, videos });
}

export function search(req, res) {
  res.send("Search page");
}

export async function watchVideo(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("watch", {
    pageTitle: video.title,
    video,
    fakeUser,
  });
}

export function uploadVideoGet(req, res) {
  return res.render("upload", { pageTitle: `Upload Video`, fakeUser });
}

export async function uploadVideoPost(req, res) {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title: title,
      description: description,
      hashtags: hashtags
        .split(" ")
        .map((word) =>
          !word.trim().startsWith("#") ? `#${word.trim()}` : word.trim(),
        ),
    });
    return res.redirect("/");
  } catch (err) {
    return res.render("upload", {
      pageTitle: `Upload Video`,
      fakeUser,
      errMessage: err._message,
    });
  }
}

export async function editVideoGet(req, res) {
  const { id } = req.params;
  const video = await Video.findById(id);
  res.render("edit", { pageTitle: `Edit ${video.title}`, fakeUser, video });
}

export async function editVideoPost(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  let video = await Video.findById(id);
  video.title = title;
  return res.redirect(`/videos/${id}`);
}

export function deleteVideo(req, res) {
  res.send(`Delete #${req.params.id} video page`);
}
