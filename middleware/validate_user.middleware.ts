import {  Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, TokenPayload } from "../types";

export const validateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token; // safe now

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error: any) {
    console.error("Error in verifyToken middleware:", error.message);
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
