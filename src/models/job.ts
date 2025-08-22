import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  type: "permanent" | "contract" | "internship";
  site: "on-site" | "remote" | "hybrid";
  experience: "entry" | "mid" | "senior";
  applicantsNeeded?: number;
  noOfApplicants?: number;
  deadline?: Date;
  salary?: number;
  createdBy: mongoose.Types.ObjectId;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["permanent", "contract", "internship"], default: "permanent" },
  site: { type: String, enum: ["on-site", "remote", "hybrid"], default: "on-site" },
  experience: { type: String, enum: ["entry", "mid", "senior"], default: "entry" },
  applicantsNeeded: { type: Number, default: 1 },
  noOfApplicants: { type: Number, default: 0 },
  deadline: { type: Date },
  salary: {type: Number}, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, onDelete: "cascade" },
});

export default mongoose.model<IJob>("Job", JobSchema);
