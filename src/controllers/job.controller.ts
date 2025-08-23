import job from "../models/job";
import { CreateJobRequest, GetJobRequest } from "../types";
import { Response } from "express";

export const createJob = async (req: CreateJobRequest, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      site,
      experience,
      applicantsNeeded,
      noOfApplicants,
      deadline,
      salary,
    } = req.body;
    const createdBy = req.userId;
    // console.log("CreatedBy: ", req.userId);
    console.log("Role in createJob:", req.body);

    if (
      !title ||
      !description ||
      !type ||
      !site ||
      !experience ||
      !createdBy ||
      !applicantsNeeded ||
      !deadline ||
      !salary
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    console.log("Creating job with data:", {
      title,
      description,
      createdBy,
      type,
      site,
      experience,
      applicantsNeeded,
      deadline,
      salary,
    });
    const newJob = new job({
      title,
      description,
      createdBy,
      type,
      site,
      experience,
      applicantsNeeded,
      noOfApplicants,
      deadline,
      salary,
    });

    await newJob.save();

    return res.status(201).send({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getJobs = async (req: GetJobRequest, res: Response) => {
  try {
    let userId = null;
    if (req.userId) {
      userId = req.userId;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const yourJob = req.query.yourJobs === "true";

    // New filter query params
    const type = req.query.type as string; // "permanent" | "contract" | "internship"
    const site = req.query.site as string; // "on-site" | "remote" | "hybrid"
    const experience = req.query.experience as string; // "entry" | "mid" | "senior"

    const skip = (page - 1) * limit;

    // Build query object

    const query: any = {};

    if (yourJob) {
      query.createdBy = userId;
    }

    // Search in title/description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Apply filters if provided
    if (type) query.type = type;
    if (site) query.site = site;
    if (experience) query.experience = experience;

    // Execute queries to get jobs and total count
    const [jobs, totalJobs] = await Promise.all([
      job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      job.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalJobs / limit);

    if (totalJobs === 0) {
      return res.status(200).send({
        success: false,
        message: "No jobs found matching your criteria",
      });
    }

    return res.status(200).send({
      success: true,
      jobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getJobById = async (req: GetJobRequest, res: Response) => {
  try {
    const jobId = req.params.id;

    const foundJob = await job
      .findById(jobId)
      .populate("createdBy", "name email");

    if (!foundJob) {
      return res.status(404).send({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).send({
      success: true,
      job: foundJob,
    });
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteJob = async (req: any, res: Response) => {
  try {
    const jobId = req.params.id;
    const userId = req.userId;
    const userRole = req.role;

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!jobId) {
      return res.status(400).send({
        success: false,
        message: "Job ID is required",
      });
    }

    let jobDoc: any = null;

    if (userRole === "admin") {
      jobDoc = await job.findById(jobId);
    } else {
      jobDoc = await job.findOne({ _id: jobId, createdBy: userId });
    }

    if (!jobDoc) {
      return res.status(404).send({
        success: false,
        message: "Job not found or you do not have permission to delete it",
      });
    }

    await jobDoc.deleteOne();

    return res.status(200).send({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting job by ID:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
