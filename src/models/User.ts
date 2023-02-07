import { model, Schema } from "mongoose";

interface IUserSchema {
  name: string;
  password: string;
  isOnline: boolean;
}

const UserSchema = new Schema<IUserSchema>(
  {
    name: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isOnline: { type: Boolean },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
