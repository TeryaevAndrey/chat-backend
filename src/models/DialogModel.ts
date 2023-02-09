import { model, Schema } from "mongoose";

interface IDialogSchema {
  creator: string;
  fellow: string;
  creatorName: string;
  fellowName: string;
  lastMessage: string;
}

const DialogSchema = new Schema<IDialogSchema>(
  {
    creator: { type: String, required: true },
    fellow: { type: String, required: true },
    creatorName: { type: String, required: true },
    fellowName: { type: String, required: true },
    lastMessage: { type: String },
  },
  { timestamps: true }
);

export default model("Dialog", DialogSchema);
