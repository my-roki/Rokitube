import express from "express";
import morgan from "morgan";

const app = express();
const port = 4000;
const logger = morgan("dev");

function handleListening() {
  console.log(`🚀 Server listening on : http://localhost:${port}`);
}

function testLogger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

function protectMiddleware(req, res, next) {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>You are Not Allowed</h1>");
  }

  console.log(`${url} Allowed.`);
  next();
}

app.use(logger, testLogger, protectMiddleware);

app.get("/", (req, res) => {
  // console.log(req);
  return res.send('<h1>Welcom Home "/" Page</h1>');
});

app.get("/login", (req, res) => {
  return res.send("This is login page!");
});

app.get("/protected", (req, res) => {
  return res.send("This is private proctected page!!");
});

app.listen(port, handleListening);
