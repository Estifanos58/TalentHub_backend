import { Request, Response } from "express";
import user, { IUser } from "../models/user";
import { generateToken } from "../utils/generateToke";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
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

    const userResponse = newUser.toObject() as Partial<IUser>;
    delete userResponse.password;

    return res
      .status(201)
      .json({ message: "New user created", data: userResponse });
  } catch (error) {
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

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
    });

    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};