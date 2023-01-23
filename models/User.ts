import {model, Schema} from "mongoose";

const UserSchema = new Schema({
  name: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

module.exports = model("User", UserSchema);