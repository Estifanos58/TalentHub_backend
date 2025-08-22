import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route";
import jobRoute from "./routes/job.route";
import applicationRoute from "./routes/applications.route";

const app: Application = express();

// .env configuration
dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3000;

// Routes
app.use("/auth", userRoute);
app.use("/jobs", jobRoute);
app.use("/application", applicationRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.listen(port, () => {
  connectDB();
  console.log("Server listning in port ", port);
});
