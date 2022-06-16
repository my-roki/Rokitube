import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export function joinGet(req, res) {
  res.status(200).render("join", { pageTitle: "Join Page" });
}

export async function joinPost(req, res) {
  const { username, email, password, passwordConfirm, location, group } =
    req.body;
  const userExsist = await User.exists({ username: username });
  if (userExsist) {
    return res.status(400).render("join", {
      pageTitle: "Join Page",
      errMessage: `The username "${username}" already exist`,
    });
  }
  const emailExsist = await User.exists({ email: email });
  if (emailExsist) {
    return res.status(400).render("join", {
      pageTitle: "Join Page",
      errMessage: `The email "${email}" is already exist`,
    });
  }
  if (password !== passwordConfirm) {
    return res.status(400).render("join", {
      pageTitle: "Join Page",
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
      errMessage: err._message,
    });
  }
}

export function loginGet(req, res) {
  res.render("login", { pageTitle: "Login" });
}

export async function loginPost(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(404).render("login", {
      errMessage: "An account with this user does not exists",
    });
  }
  const okPassword = await bcrypt.compare(password, user.password);
  if (!okPassword) {
    return res.status(400).render("login", {
      errMessage: "Wrong password!",
    });
  }

  req.session.isLogin = true;
  req.session.username = username;
  return res.redirect("/");
}

export function startGithubLogin(req, res) {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const resultUrl = `${baseUrl}?${params}`;

  res.redirect(resultUrl);
}

export async function finishGithubLogin(req, res) {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();
  const resultUrl = `${baseUrl}?${params}`;
  const tokenData = await (
    await fetch(resultUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  const apiUrl = "https://api.github.com";
  if ("access_token" in tokenData) {
    const { access_token } = tokenData;
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const userEmailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    // console.log(userData);
    // console.log(userEmailData);

    const targetEmail = userEmailData.find(
      (email) => email.primary === true && email.verified === true,
    );
    // console.log(targetEmail);
    if (!targetEmail) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: targetEmail.email });
    if (!user) {
      user = await User.create({
        username: userData.name ? userData.name : userData.login,
        email: targetEmail.email,
        password: "",
        socialOnly: true,
        location: userData.location ? userData.location : "Nowhere",
        group: 3,
        avatar: userData.avatar_url,
      });
    }
    req.session.isLogin = true;
    req.session.username = user.username;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
}

export function logout(req, res) {
  req.session.destroy();
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
