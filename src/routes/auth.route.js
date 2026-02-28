import express from "express";
import { signup, login, logout, check } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetMiddleware } from "../middleware/arcjet.middleware.js";

const router = express.Router();
router.use(arcjetMiddleware);

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/logout" , logout);
router.get("/check" , protectRoute, check);

export default router;