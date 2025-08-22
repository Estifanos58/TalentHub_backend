import job from "../models/job";
import { CreateJobRequest, GetJobRequest } from "../types";
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


export const getJobs = async (req: GetJobRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
        
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // We will search in 'title' and 'description' fields
        const query: any = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute queries to get jobs and total count
        const [jobs, totalJobs] = await Promise.all([
            job.find(query)
               .sort({ createdAt: -1 })
               .skip(skip)
               .limit(limit),
            job.countDocuments(query)
        ]);

        // Calculate total pages
        const totalPages = Math.ceil(totalJobs / limit);

        if (totalJobs === 0) {
            return res.status(404).send({
                success: false,
                message: "No jobs found matching your criteria"
            });
        }
        
        return res.status(200).send({
            success: true,
            jobs,
            pagination: {
                totalJobs,
                totalPages,
                currentPage: page,
                limit
            }
        });

    } catch (error) {
        console.error("Error fetching jobs:", error); 
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
}