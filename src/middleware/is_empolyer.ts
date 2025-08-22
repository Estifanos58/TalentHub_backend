import {  Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const isEmployer = (req: AuthRequest , res: Response, next: NextFunction) =>{
    if(!req.role) {
        return res.status(400).send({
            success: false,
            message: "Role not found in request"
        });
    }
    if(req.role !== "employer") {
        return res.status(403).send({
            success: false,
            message: "Access denied: You are not an employer"
        });
    }

    next();
} 