import User from "../models/User";
import fetch from "node-fetch";

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
      (email) => email.primary === true && email.verified === true
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
        avatar: userData.avatar_url,
      });
    }
    req.session.isLogin = true;
    req.session.loginUser = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
}

// ? https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#oauth-2.0-endpoints
// ? aAuth2.0을 통해서 access_code를 가져와 사용자 정보를 불러올 수 있는 access_token을 가져온 후 사용자 정보 출력
// ? (https://ahn3330.tistory.com/166)
export function startGoogleLogin(req, res) {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const config = {
    client_id: process.env.GOOGLE_CLIENT,
    redirect_uri: "http://localhost:4000/users/google/finish",
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    // state: "??"
  };
  const params = new URLSearchParams(config).toString();
  const resultUrl = `${baseUrl}?${params}`;

  res.redirect(resultUrl);
}

export async function finishGoogleLogin(req, res) {
  const baseUrl = "https://oauth2.googleapis.com/token";
  const config = {
    client_id: process.env.GOOGLE_CLIENT,
    client_secret: process.env.GOOGEL_SECRET,
    code: req.query.code,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:4000/users/google/finish",
  };
  const params = new URLSearchParams(config).toString();
  const resultUrl = `${baseUrl}?${params}`;
  const tokenData = await (
    await fetch(resultUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
  ).json();

  const apiUrl = "https://www.googleapis.com";
  if ("access_token" in tokenData) {
    const { access_token } = tokenData;
    const userData = await (
      await fetch(`${apiUrl}/oauth2/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    // console.log(userData);

    if (!userData.verified_email) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: userData.email });
    if (!user) {
      user = await User.create({
        username: userData.name,
        email: userData.email,
        password: "",
        socialOnly: true,
        avatar: userData.picture,
      });
    }
    req.session.isLogin = true;
    req.session.loginUser = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
}
