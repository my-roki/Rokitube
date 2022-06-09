const fakeUser = {
  username: "roki",
  isLogin: true,
};

let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];

export function home(req, res) {
  res.render("home", { pageTitle: "Home", fakeUser, videos });
}

export function search(req, res) {
  res.send("Search page");
}

export function watchVideo(req, res) {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", {
    pageTitle: `Watch ${video.title}`,
    video,
    fakeUser,
  });
}

export function uploadVideoGet(req, res) {
  return res.render("upload", { pageTitle: `Upload Video`, fakeUser });
}

export function uploadVideoPost(req, res) {
  const result = {
    title: req.body.title,
    rating: 0,
    comments: 0,
    createdAt: "Just Now",
    views: 0,
    id: videos.length + 1,
  };
  console.log(result);
  videos.push(result);
  return res.redirect("/");
}

export function editVideoGet(req, res) {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("edit", { pageTitle: `Edit ${video.title}`, fakeUser, video });
}

export function editVideoPost(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
}

export function deleteVideo(req, res) {
  res.send(`Delete #${req.params.id} video page`);
}
