import { model, Schema } from "mongoose";

interface IDialogSchema {
  creator: string;
  fellow: string;
  creatorAvatar: string;
  fellowAvatar: string;
  creatorName: string;
  fellowName: string;
  lastMessage: string;
}

const DialogSchema = new Schema<IDialogSchema>(
  {
    creator: { type: String, required: true },
    fellow: { type: String, required: true },
    creatorAvatar: {type: String, required: true},
    fellowAvatar: {type: String, required: true},
    creatorName: { type: String, required: true },
    fellowName: { type: String, required: true },
    lastMessage: { type: String },
  },
  { timestamps: true }
);

const DialogModel = model("Dialog", DialogSchema);

export default DialogModel;
