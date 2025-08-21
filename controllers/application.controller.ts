import applications from "../models/applications";
import { CreateApplicationRequest, GetApplicationRequest } from "../types";
import { Response } from "express";

export const applyForJob = async (req: CreateApplicationRequest, res: Response) => {
    try {
        const { jobId } = req.body;
        const userId = req.userId;

        if (!jobId) {
            return res.status(400).send({
                success: false,
                message: "Job ID is required"
            });
        }

        // Assuming we have a model for applications
        const application = await applications.create({
            jobId,
            userId,
            status: "applied"
        });

        return res.status(201).send({
            success: true,
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getApplication = async (req: GetApplicationRequest, res: Response) => {
    try {
        const userId = req.params.id

        if (!userId) {
            return res.status(400).send({
                success: false,
                message: "User ID not found"
            });
        }

        const applicationsList = await applications.find({ userId });

        if (!applicationsList || applicationsList.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No applications found for this user"
            });
        }

        return res.status(200).send({
            success: true,
            applications: applicationsList
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
}