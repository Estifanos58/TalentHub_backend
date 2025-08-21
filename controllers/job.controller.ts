import job from "../models/job";
import { CreateJobRequest } from "../types";
import { Response } from "express";

export const createJob = async (req: CreateJobRequest, res: Response) => {
    try {
        const { title, description } = req.body;
        const createdBy = req.userId; 

        if (!title || !description) {
            return res.status(400).send({
                success: false,
                message: "All fields are required"
            });
        }

        const newJob = await job.create({
            title,
            description,
            createdBy
        });

        return res.status(201).send({
            success: true,
            message: "Job created successfully",
            job: newJob
        });
    } catch (error) {
        console.error("Error creating job:", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await job.find();
        
        if (!jobs || jobs.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No jobs found"
            });
        }

        return res.status(200).send({
            success: true,
            jobs
        });
    } catch (error) {
        console.error("Error creating job:", error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
}