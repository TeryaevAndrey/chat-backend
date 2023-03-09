import { model, Schema } from "mongoose";

interface IDialogSchema {
  creator: string;
  fellow: string;
  lastMessage: string;
}

const DialogSchema = new Schema<IDialogSchema>(
  {
    creator: { type: String, required: true },
    fellow: { type: String, required: true },
    lastMessage: { type: String },
  },
  { timestamps: true }
);

const DialogModel = model("Dialog", DialogSchema);

export default DialogModel;
