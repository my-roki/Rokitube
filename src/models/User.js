import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  socialOnly: { type: Boolean, default: false },
  location: { type: String },
  group: { type: Number },
  avatar: {
    type: String,
    default: "uploads/default_profile.jpg",
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
