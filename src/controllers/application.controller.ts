import applications from "../models/applications";
import job from "../models/job";
import {
  CreateApplicationRequest,
  GetApplicationByIdRequest,
  GetApplicationsRequest,
  UpdateApplicationStatusRequest,
} from "../types";
import { Response } from "express";

export const applyForJob = async (
  req: CreateApplicationRequest,
  res: Response
) => {
  try {
    const { jobId, coverLetter, resume } = req.body;
    const userId = req.userId;

    if (!jobId) {
      return res.status(400).send({
        success: false,
        message: "Job ID is required",
      });
    }

    if (!coverLetter && !resume) {
      return res.status(400).send({
        success: false,
        message: "Either cover letter or resume is required",
      });
    }

    const applicantAlreadyExist = await applications.findOne({
      jobId,
      userId,
    });

    if (applicantAlreadyExist) {
      return res.status(208).send({
        success: false,
        message: "Application Already Registerd",
      });
    }

    // Is Application for the Given Job Already full
    const foundJob = await job.findById(jobId);

    if (!foundJob) {
      return res.status(404).send({
        success: false,
        message: "Job Not Found",
      });
    }

    if (
      foundJob.noOfApplicants &&
      foundJob.applicantsNeeded &&
      foundJob.noOfApplicants >= foundJob.applicantsNeeded
    ) {
      return res.status(400).send({
        success: false,
        message: "Application for this job is full",
      });
    }

    // Check for Deadline
    if (foundJob.deadline) {
      const currentDate = new Date();
      if (currentDate > foundJob.deadline) {
        return res.status(400).send({
          success: false,
          message: "Application deadline has passed",
        });
      }
    }

    const application = await applications.create({
      jobId,
      userId,
      status: "applied",
      coverLetter,
      resume,
    });

    // Increment the noOfApplicants count in the job document
    if (foundJob.noOfApplicants !== undefined) {
      foundJob.noOfApplicants += 1;
      await foundJob.save();
    }

    return res.status(201).send({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getApplications = async (
  req: GetApplicationsRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const jobId = req.query.jobId;

    // console.log("job:", jobId);

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User ID not found",
      });
    }

    // Get pagination params from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get status filter from query
    const status = req.query.status as string | undefined;

    const query: any = {}
    // Build query
    if(jobId){
       query.jobId = jobId;
    }else {
      query.userId = userId;
    }
    
    if (status && ["applied", "shortlisted", "rejected"].includes(status)) {
      query.status = status;
    }

    // Count total documents for pagination metadata
    const totalApplications = await applications.countDocuments(query);

    // Dynamically populate based on whether jobId is present
    const applicationsList = await applications
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "jobId",
        select:
          "title",
        populate: { path: "createdBy", select: "username email" },
      })
      .populate("userId", "username email");
 

    if (!applicationsList || applicationsList.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No applications found for this user",
      });
    }

    return res.status(200).send({
      success: true,
      applications: applicationsList,
      pagination: {
        total: totalApplications,
        page,
        limit,
        totalPages: Math.ceil(totalApplications / limit),
      },
      filters: {
        status: status || "all",
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getApplicationById = async (
  req: GetApplicationByIdRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const applicationId = req.params.id;

    if (!applicationId) {
      return res.status(400).send({
        success: false,
        message: "Internal server error",
      });
    }

    const application = await applications
      .findById(applicationId)
      .populate({
        path: "jobId",
        select:
          "title description createdBy site experience type salary deadline noOfApplicants applicantsNeeded",
        populate: { path: "createdBy", select: "username email" },
      })
      .populate("userId", "username email");

    if (!application) {
      return res.status(400).json({
        success: false,
        message: "Application With this Id not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateApplicationStatus = async (
  req: UpdateApplicationStatusRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const applicationId = req.params.id;
    const { status } = req.body;

    console.log(
      "Updating application:",
      applicationId,
      "to status:",
      status,
      "by user:",
      userId
    );

    if (!applicationId) {
      return res.status(400).send({
        success: false,
        message: "Application ID is required",
      });
    }

    if (!status || !["shortlisted", "rejected"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Valid status is required (shortlisted or rejected)",
      });
    }

    const application = await applications.findById(applicationId).populate({
      path: "jobId",
      select: "createdBy",
    });

    if (!application) {
      return res.status(404).send({
        success: false,
        message: "Application not found",
      });
    }

    // Type assertion to access createdBy on populated jobId
    const jobDoc = application.jobId as unknown as { createdBy: any };

    if (!jobDoc.createdBy || jobDoc.createdBy.toString() !== userId) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to update this application",
      });
    }

    application.status = status;

    await application.save();

    return res.status(200).send({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
