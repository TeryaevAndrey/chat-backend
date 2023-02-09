import { model, Schema } from "mongoose";

interface IMessageSchema {
  message: string;
  dialog: string;
  sender: string;
}

const MessageSchema = new Schema<IMessageSchema>(
  {
    message: { type: String, required: true },
    dialog: { type: String, required: true },
    sender: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
