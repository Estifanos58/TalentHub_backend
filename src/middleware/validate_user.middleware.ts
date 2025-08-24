import {  Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, TokenPayload } from "../types";

export const validateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // console.log("Authorization header:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
        data: null,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    // console.log("Decoded token:", decoded);

    req.userId = decoded.id;

    // console.log("Authenticated user ID:", req.userId);

    req.role = decoded.role;

    next();
  } catch (error: any) {
    console.error("Error in verifyToken middleware:", error.message);
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
      data: null
    });
  }
};
