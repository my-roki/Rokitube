import mongoose, { mongo } from "mongoose";

const videoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, required: true, default: Date.now },
  createdAtFromNow: { type: String },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (!word.startsWith("#") ? `#${word}` : word));
});

videoSchema.static("formatFileDestination", function (destination) {
  return destination.replaceAll("\\", "/");
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
