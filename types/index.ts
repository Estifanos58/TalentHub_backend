import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string;
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