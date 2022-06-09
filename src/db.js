import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/youtube_clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.log(`❌ Database connection Error: ${err}`);
});
db.once("open", () => {
  console.log("🔗 Database Connected!");
});
