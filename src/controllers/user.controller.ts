import { Request, Response } from "express";
import user, { IUser } from "../models/user";
import { generateToken } from "../utils/generateToke";
import { AuthRequest } from "../types";
import mongoose from "mongoose";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if(role){
      console.log("Role: ", role)
      if(role !== "employer" && role !== "applicant" && role !== "admin"){
        return res.status(400).json({ message: "Role must be either 'employer' or 'applicant'" });
      }
    }

    const existingUser = await user.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new user({
      username,
      email,
      password,
      role: role || "applicant",
    });

    await newUser.save();


    const userResponse = newUser.toObject() as Partial<IUser>;
    delete userResponse.password;

    const token = generateToken(newUser._id, newUser.role);
  

    return res
      .status(201)
      .json({ message: "New user created", data: userResponse, token });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(existingUser._id, existingUser.role);

    const userResponse = existingUser.toObject() as Partial<IUser>;
    delete userResponse.password;


    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserController = async (req: AuthRequest, res: Response) => {
  try {
    // console.log("Get user controller hit");

    const userId = req.userId;
    // console.log("User ID from token:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // console.log("User ID from token:", userId, typeof userId);

    // const objectId = new mongoose.Types.ObjectId(userId)
    // console.log("ObjectId:", objectId, typeof objectId);
   const existingUser = await user.findById(userId);
    // console.log("Existing user:", existingUser);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = existingUser.toObject() as Partial<IUser>;
    delete userResponse.password;

    return res.status(200).json({ message: "User fetched successfully", data: userResponse });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};