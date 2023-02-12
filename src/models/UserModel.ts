import mongoose, { model, Schema } from "mongoose";

interface IUserSchema {
  avatar?: string;
  userName: string;
  password: string;
  isOnline: boolean;
  wasOnline?: string;
}

const UserSchema = new Schema<IUserSchema>(
  {
    avatar: { type: String, required: false },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isOnline: { type: Boolean, required: true },
    wasOnline: { type: String, required: false },
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);

export default mongoose.models.User || UserModel;
