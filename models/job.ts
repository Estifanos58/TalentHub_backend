import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, onDelete: "cascade" },
});

export default mongoose.model<IJob>("Job", JobSchema);
