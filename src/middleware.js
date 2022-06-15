export function localMiddleware(req, res, next) {
  res.locals.isLogin = Boolean(req.session.isLogin);
  res.locals.username = String(req.session.username);
  // console.log(req.sessionID);
  // console.log(res.locals);
  next();
}
