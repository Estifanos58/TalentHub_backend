import { Router } from "express";
import { getAdminDashboard } from "../controllers/admin.controller";
import { validateUser } from "../middleware/validate_user.middleware";
import { isAdmin } from "../middleware/is_empolyer";

const router = Router();

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get Admin Dashboard
 *     description: Retrieve important statistics and data for the admin dashboard.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []   # Requires JWT Bearer token
 *     responses:
 *       200:
 *         description: Successful response with dashboard data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usersCount:
 *                   type: number
 *                   example: 120
 *                 jobsCount:
 *                   type: number
 *                   example: 45
 *                 applicationsCount:
 *                   type: number
 *                   example: 200
 *       401:
 *         description: Unauthorized (token missing or invalid).
 *       403:
 *         description: Forbidden (user is not an admin).
 *       500:
 *         description: Internal server error.
 */
router.get("/", validateUser, isAdmin, getAdminDashboard);

export default router;
