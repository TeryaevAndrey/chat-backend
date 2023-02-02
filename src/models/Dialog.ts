import { model, Schema, SchemaDefinitionProperty, Types } from "mongoose";

interface IDialogSchema {
  mainUserId: string;
  comradeId: string;
  lastMessage: Types.ObjectId;
}

const DialogSchema = new Schema<IDialogSchema>(
  {
    mainUserId: {type: String, ref: "User"},
    comradeId: {type: String, require: true},
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = model("Dialog", DialogSchema);
