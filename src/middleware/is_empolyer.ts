import {  Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const isEmployer = (req: AuthRequest , res: Response, next: NextFunction) =>{
    if(!req.role) {
        return res.status(400).send({
            success: false,
            message: "Role not found in request"
        });
    }
    if(req.role !== "employer" && req.role !== "admin") {
        // console.log("Hi From Here ", req.role);
        return res.status(403).send({
            success: false,
            message: "Access denied: You are not an employer or admin"
        });
    }

    console.log("User is an employer or admin, proceeding...");
    next();
} 

export const isAdmin = (req: AuthRequest , res: Response, next: NextFunction) =>{
    if(!req.role) {
        return res.status(400).send({
            success: false,
            message: "Role not found in request"
        });
    }
    if(req.role !== "admin") {
        // console.log("Hi From Here ", req.role);
        return res.status(403).send({
            success: false,
            message: "Access denied: You are not an admin"
        });
    }

    console.log("User is an admin, proceeding...");
    next();
}