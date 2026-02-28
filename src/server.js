import express from "express";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // middleware
app.use(cookieParser()); // parse cookies for auth


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
