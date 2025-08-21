import { Request, Response } from "express";
import user, { IUser } from "../models/user";

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
