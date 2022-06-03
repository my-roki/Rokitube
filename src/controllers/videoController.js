const fakeUser = {
  username: "roki",
  isLogin: false,
};

export function home(req, res) {
  const videos = [
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
      id: 1,
    },
    {
      title: "Third Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
  ];
  res.render("home", { pageTitle: "Home", fakeUser, videos });
}

export function search(req, res) {
  res.send("Search page");
}

export function watchVideo(req, res) {
  res.send(`Watch #${req.params.id} video page`);
}

export function uploadVideo(req, res) {
  res.send("Upload video page");
}

export function editVideo(req, res) {
  res.render("edit", { pageTitle: "Edit" });
}

export function deleteVideo(req, res) {
  res.send(`Delete #${req.params.id} video page`);
}
