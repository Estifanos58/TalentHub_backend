import mongoose, { Schema, Document } from "mongoose";

export interface IApplications extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  coverLetter?: string;
  resume?: string;
  status: "applied" | "shortlisted"| "rejected";
}

const ApplicationsSchema: Schema = new Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String },
    resume: { type: String },
    status: { type: String, enum: ["applied", "shortlisted", "rejected"], default: "applied" },

});

export default mongoose.model<IApplications>("Applications", ApplicationsSchema);
