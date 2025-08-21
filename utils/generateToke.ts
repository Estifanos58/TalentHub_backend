import jwt from "jsonwebtoken";
export function generateToken(userId, role) {
    const token = jwt.sign(
        { id: userId, role: role },
        process.env.JWT_SECRET as string,
        { expiresIn: "30d" }
    );

    return token;
}