export function home(req, res) {
  res.send("Home page");
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
  res.send(`Edit #${req.params.id} video page`);
}

export function deleteVideo(req, res) {
  res.send(`Delete #${req.params.id} video page`);
}
