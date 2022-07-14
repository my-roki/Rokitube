import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3: s3,
  bucket: "youtube-myroki",
  acl: "public-read",
});

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
    req.flash("error", "Not Authorized");
    return res.redirect("/login");
  }
}

export function publicOnlyMiddleware(req, res, next) {
  if (req.session.isLogin) {
    req.flash("error", "Not Authorized");
    return res.redirect("/");
  } else {
    return next();
  }
}

export const uploadAvatar = multer({
  dest: "uploads/avatar/",
  limits: { fileSize: 3000000 },
  storage: multerUploader,
});

export const uploadVideo = multer({
  dest: "uploads/video/",
  limits: { fileSize: 536870912 },
  storage: multerUploader,
});
