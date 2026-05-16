import express from "express";
import { getProfile, updateProfile, getRecentReviews } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/reviews", authMiddleware, getRecentReviews);
export default router;