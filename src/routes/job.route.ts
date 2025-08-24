import { Router } from "express";
import { validateUser } from "../middleware/validate_user.middleware";
import { isEmployer } from "../middleware/is_empolyer";
import { createJob, deleteJob, getJobById, getJobs } from "../controllers/job.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management APIs
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", validateUser, isEmployer, createJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", getJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get("/:id", getJobById);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 */
router.delete('/:id', validateUser, deleteJob);

export default router;
