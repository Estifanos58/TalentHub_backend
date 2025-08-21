//npm i cookie-parser mailtrap bcryptjs dotenv jsonwebtoken mongoose crypto

import express from "express";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.ts";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.ts"; // Assuming you have a user route file

// .env configuration
dotenv.config()


const app = express();


app.use(cors({
    origin: process.env.CLIENT_URL, // Change to your frontend URL
    credentials: true // This is important!
}));


app.use(express.json())
app.use(cookieParser());
const port = process.env.PORT || 5500

// Routes
app.use("/auth", userRoute)

app.get("/", (req,res)=>{
    res.send("Hello here is the backend")
})

app.listen(port, ()=>{
    connectDB();
    console.log("Server listning in port ", port)
})