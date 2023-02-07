import { model, Schema, Types } from "mongoose";

interface IMessageSchema {
  message: string;
  dialog: Types.ObjectId;
  sender: Types.ObjectId | string;
}

const MessageSchema = new Schema<IMessageSchema>({
  message: { type: String, require: true },
  dialog: { type: Schema.Types.ObjectId, require: true, ref: "Dialog" },
  sender: { type: Schema.Types.ObjectId, require: true, ref: "User" },
});

export default model("Message", MessageSchema);
