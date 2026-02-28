import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser";
dotenv.config();
import { connectDB } from "../lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // middleware
app.use(cookieParser()); // parse cookies for auth


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
