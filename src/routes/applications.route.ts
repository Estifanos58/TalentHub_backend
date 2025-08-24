import { Router } from "express";
import { applyForJob, getApplicationById, getApplications, updateApplicationStatus } from "../controllers/application.controller";
import { validateUser } from "../middleware/validate_user.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application management
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: "64a9f7b8c12e5e001f8e9f21"
 *               coverLetter:
 *                 type: string
 *                 example: "I am very interested in this role..."
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', validateUser, applyForJob);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get all applications of the logged-in user
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   jobId:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, shortlisted, rejected]
 *       401:
 *         description: Unauthorized
 */
router.get('/', validateUser, getApplications);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 jobId:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', validateUser, getApplicationById);

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, shortlisted, rejected]
 *                 example: shortlisted
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.patch('/:id', validateUser, updateApplicationStatus);

export default router;
