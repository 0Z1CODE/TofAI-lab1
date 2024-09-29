import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    telegram_id: {
      type: Number,
      requered: true,
      unique: true,
    },
    is_bot: {
      type: Boolean,
      requered: true,
      unique: false,
    },
    language_code: {
      type: String,
      requered: false,
      unique: false,
    },
    is_premium: {
      type: Boolean,
      requered: false,
      unique: false,
    },
    first_name: {
      type: String,
      requered: false,
    },
    last_name: {
      type: String,
      requered: true,
      unique: false,
    },
    username: {
      type: String,
      requered: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
