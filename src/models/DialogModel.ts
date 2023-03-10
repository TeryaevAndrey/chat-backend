import { model, Schema } from "mongoose";

interface IDialogSchema {
  creator: Schema.Types.ObjectId;
  fellow: Schema.Types.ObjectId;
  lastMessage: string;
}

const DialogSchema = new Schema<IDialogSchema>(
  {
    creator: { type: String, required: true, ref: "User" },
    fellow: { type: String, required: true, ref: "User" },
    lastMessage: { type: String },
  },
  { timestamps: true }
);

const DialogModel = model("Dialog", DialogSchema);

export default DialogModel;
