import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
dotenv.config();
import { connectDB } from "../lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // middleware

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
