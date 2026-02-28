import express from "express";
import { updateProfilePicture } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// RESTful route: PATCH /api/user/:id
router.patch("/:id", protectRoute, updateProfilePicture);

export default router;
