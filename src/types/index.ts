import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: any;
  role?: string;
  cookies: { [key: string]: string }; 
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export interface JobRegisterBody {
  title: string;
  description: string;
  type: "permanent" | "contract" | "internship";
  site: "on-site" | "remote" | "hybrid";
  experience: "entry" | "mid" | "senior";
}


export interface CreateJobRequest extends AuthRequest {
  // We're overriding the generic 'body' property with our specific type
  body: JobRegisterBody;
}

export interface applicationBody {
  jobId: string;
}

export interface CreateApplicationRequest extends AuthRequest {
  body: applicationBody;
}

export interface GetApplicationRequest extends AuthRequest {
  params: {
    id: string; 
  };
}

export interface GetJobRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    search?: string;
    type?: string; // "permanent" | "contract" | "internship"
    site?: string; // "on-site" | "remote" | "hybrid"
    experience?: string; // "entry" | "mid" | "senior"
  }
}