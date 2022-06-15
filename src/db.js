import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
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
