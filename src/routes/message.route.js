import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetMiddleware } from "../middleware/arcjet.middleware.js";
import { getAllContacts, getMessages, sendMessage, getChatPartners } from "../controllers/message.controller.js";

const router = express.Router();
router.use(protectRoute);
router.use(arcjetMiddleware);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners); // placed before dynamic route
router.get("/:receiverId", getMessages);
router.post("/:receiverId", sendMessage);

export default router;