import { model, Schema, SchemaDefinitionProperty, Types } from "mongoose";

interface IDialogSchema {
  participants: SchemaDefinitionProperty[] | string[];
  lastMessage: Types.ObjectId;
}

const DialogSchema = new Schema<IDialogSchema>(
  {
    participants: { type: Array },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = model("Dialog", DialogSchema);
