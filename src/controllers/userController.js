import User from "../models/User";
import bcrypt from "bcrypt";

const fakeUser = {
  username: "roki",
  isLogin: false,
};

export function joinGet(req, res) {
  res.status(200).render("join", { pageTitle: "Join Page", fakeUser });
}

export async function joinPost(req, res) {
  const { username, email, password, passwordConfirm, location, group } =
    req.body;
  const userExsist = await User.exists({ username: username });
  if (userExsist) {
    return res.status(400).render("join", {
      pageTitle: "Join Page",
      fakeUser,
      errMessage: `The username "${username}" already exist`,
    });
  }
  const emailExsist = await User.exists({ email: email });
  if (emailExsist) {
    return res.status(400).render("join", {
      pageTitle: "Join Page",
      fakeUser,
      errMessage: `The email "${email}" is already exist`,
    });
  }
  if (password !== passwordConfirm) {
    return res.status(400).render("join", {
      pageTitle: "Join Page",
      fakeUser,
      errMessage: `The password does not match`,
    });
  }
  try {
    await User.create({
      username: username,
      email: email,
      password: password,
      location: location,
      group: parseInt(group),
    });
    return res.status(200).redirect("/login");
  } catch (err) {
    return res.status(400).render("join", {
      pageTitle: "Join Page",
      fakeUser,
      errMessage: err._message,
    });
  }
}

export function loginGet(req, res) {
  res.render("login", { fakeUser });
}

export async function loginPost(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).render("login", {
      fakeUser,
      errMessage: "An account with this user does not exists",
    });
  }
  const okPassword = await bcrypt.compare(password, user.password);
  if (!okPassword) {
    return res.status(400).render("login", {
      fakeUser,
      errMessage: "Wrong password!",
    });
  }

  req.session.isLogin = true;
  req.session.username = username;
  return res.redirect("/");
}

export function logout(req, res) {
  req.session.isLogin = false;
  req.session.username = "";
  return res.redirect("/");
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
