import { model, Schema } from "mongoose";

interface IUserSchema {
  avatar?: string;
  userName: string;
  password: string;
  isOnline: boolean;
  wasOnline?: string;
}

const UserSchema = new Schema<IUserSchema>(
  {
    avatar: { type: String },
    userName: { type: String, required: true },
    password: {type: String, required: true},
    isOnline: { type: Boolean, required: true },
    wasOnline: { type: String },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
