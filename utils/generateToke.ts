import jwt from "jsonwebtoken";
import { TokenPayload } from "../types";

export function generateToken(userId, role) {
  const token = jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET as string,
    { expiresIn: "30d" }
  ) as TokenPayload;

  return token;
}