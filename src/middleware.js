export function localMiddleware(req, res, next) {
  // console.log(req.session.isLogin);
  // console.log(req.session.loginUser);
  res.locals.isLogin = Boolean(req.session.isLogin);
  res.locals.loginUser = req.session.loginUser || {};
  next();
}

export function protectMiddleware(req, res, next) {
  if (req.session.isLogin) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

export function publicOnlyMiddleware(req, res, next) {
  if (req.session.isLogin) {
    return res.redirect("/");
  } else {
    return next();
  }
}
