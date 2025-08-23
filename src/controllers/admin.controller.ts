import { Response } from "express";
import { AuthRequest } from "../types";
import user from "../models/user";
import job from "../models/job";
import applications from "../models/applications";
import mongoose from "mongoose";

export const getAdminDashboard = async (req: AuthRequest, res: Response) => {
  try {
    /** ---------------- USERS ---------------- **/
    const availableUsers = await user.countDocuments({ role: "user" });
    const availableEmployers = await user.countDocuments({ role: "employer" });
    const availableAdmins = await user.countDocuments({ role: "admin" });
    const totalUsers = availableUsers + availableEmployers + availableAdmins;

    const last7DaysUsers = await user.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    /** ---------------- JOBS ---------------- **/
    const availableJobs = await job.countDocuments();
    const openJobs = await job.countDocuments({ status: "open" });
    const closedJobs = await job.countDocuments({ status: "closed" });

    const last30DaysJobs = await job.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    /** ---------------- APPLICATIONS ---------------- **/
    const availableApplications = await applications.countDocuments();
    const shortlistedApplications = await applications.countDocuments({
      status: "shortlisted",
    });
    const rejectedApplications = await applications.countDocuments({
      status: "rejected",
    });
    const pendingApplications = await applications.countDocuments({
      status: "pending",
    });

    const last7DaysApplications = await applications.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const avgApplicantsPerJob =
      availableJobs > 0 ? availableApplications / availableJobs : 0;

    const conversionRate =
      availableApplications > 0
        ? (shortlistedApplications / availableApplications) * 100
        : 0;

    /** ---------------- INSIGHTS ---------------- **/
    // Most applied-to job
    const mostAppliedJobAgg = await applications.aggregate([
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let mostAppliedJob = null;
    if (mostAppliedJobAgg.length > 0) {
      mostAppliedJob = await job.findById(mostAppliedJobAgg[0]._id).select("title");
    }

    // Top employer by number of jobs
    const topEmployerAgg = await job.aggregate([
      { $group: { _id: "$createdBy", jobCount: { $sum: 1 } } },
      { $sort: { jobCount: -1 } },
      { $limit: 1 },
    ]);

    let topEmployer = null;
    if (topEmployerAgg.length > 0 && mongoose.Types.ObjectId.isValid(topEmployerAgg[0]._id)) {
      topEmployer = await user.findById(topEmployerAgg[0]._id).select("username email");
    }

    /** ---------------- RESPONSE ---------------- **/
    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Data Fetched Successfully",
      data: {
        users: {
          total: totalUsers,
          normalUsers: availableUsers,
          employers: availableEmployers,
          admins: availableAdmins,
          newLast7Days: last7DaysUsers,
        },
        jobs: {
          total: availableJobs,
          open: openJobs,
          closed: closedJobs,
          newLast30Days: last30DaysJobs,
          avgApplicantsPerJob,
        },
        applications: {
          total: availableApplications,
          shortlisted: shortlistedApplications,
          rejected: rejectedApplications,
          pending: pendingApplications,
          newLast7Days: last7DaysApplications,
          conversionRate: `${conversionRate.toFixed(2)}%`,
        },
        insights: {
          mostAppliedJob: mostAppliedJob?.title || null,
          topEmployer: topEmployer
            ? { username: topEmployer.username, email: topEmployer.email }
            : null,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
