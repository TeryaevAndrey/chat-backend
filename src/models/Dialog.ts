import { model, Schema, Types } from "mongoose";

interface IDialogSchema {
  mainUserId: string;
  comradeId: string;
  mainUserName: string;
  comradeName: string;
  lastMessage: Types.ObjectId;
}

const DialogSchema = new Schema<IDialogSchema>(
  {
    mainUserId: { type: String, ref: "User" },
    comradeId: { type: String, require: true },
    mainUserName: { type: String, require: true },
    comradeName: { type: String, require: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export default model("Dialog", DialogSchema);
