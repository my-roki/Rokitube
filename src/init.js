import "dotenv/config";
import "./db";
import "./models/Videos";
import "./models/User";

import app from "./server";

const port = 4000;

function handleListening() {
  console.log(`🚀 Server listening on : http://localhost:${port}`);
}

app.listen(port, handleListening);
