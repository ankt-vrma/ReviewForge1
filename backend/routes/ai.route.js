import express from "express";
import { getReview } from "../controllers/ai.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/review", authMiddleware, getReview);
export default router;