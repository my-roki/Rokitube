import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";

import app from "./server";

const port = process.env.PORT || 4000;

function handleListening() {
  console.log(`🚀 Server listening on : http://localhost:${port}`);
}

app.listen(port, handleListening);
