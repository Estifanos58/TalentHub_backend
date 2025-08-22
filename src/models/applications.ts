import mongoose, { Schema, Document } from "mongoose";

export interface IApplications extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: "applied" | "shortlisted"| "rejected";
}

const ApplicationsSchema: Schema = new Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["applied", "shortlisted", "rejected"], default: "applied" },

});

export default mongoose.model<IApplications>("Applications", ApplicationsSchema);
