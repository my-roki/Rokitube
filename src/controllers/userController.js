export function join(req, res) {
  res.send("Join page");
}

export function login(req, res) {
  res.send("Login page");
}

export function logout(req, res) {
  res.send("Logout page");
}

export function userProfile(req, res) {
  res.send(`#${req.params.id} User Profile page`);
}

export function editUser(req, res) {
  res.send("Edit user page");
}

export function deleteUser(req, res) {
  res.send("Delete user page");
}
