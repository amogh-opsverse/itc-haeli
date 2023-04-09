const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
//import { nanoid } from "nanoid";

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4, // Use UUID v4 as the default value for the _id field
  },
  //username: String,
  username: {
    type: String,
    unique: true,
    index: true,
  },
  name: String,
  password: String,
  email: {
    type: String,
    unique: true,
  },
  bio: String,
  personality: String,
  gender: String,
  imgUrl: String,
  university: String,
  major: String,
  sleepTime: String,
  hygiene: String,
  guests: String,
  hobbies: [String],
  smoke: String,
  pets: String,
  //createdAt: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.index({ university: 1 });
UserSchema.index({ smoke: 1 });
UserSchema.index({ sleepTime: 1 });
UserSchema.index({ guests: 1 });
UserSchema.index({ personality: 1 });
UserSchema.index({ gender: 1 });
UserSchema.index({ hygiene: 1 });
UserSchema.index({ pets: 1 });

const UserModel = mongoose.model("Usertest", UserSchema);

module.exports = UserModel;
