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
  },
  name: String,
  password: String,
  email: {
    type: String,
    unique: true,
  },
  bio: String,
  personality: String,
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

const UserModel = mongoose.model("Usero", UserSchema);

module.exports = UserModel;
