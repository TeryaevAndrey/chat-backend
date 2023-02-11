import { model, Schema } from "mongoose";

interface IMessageSchema {
  message: string;
  dialog: string;
  files?: [];
  sender: string;
}

const MessageSchema = new Schema<IMessageSchema>(
  {
    message: { type: String, required: true },
    dialog: { type: String, required: true },
    files: { type: Array },
    sender: { type: String, required: true },
  },
  { timestamps: true }
);

const MessageModel = model("Message", MessageSchema);

export default MessageModel;
