import express from "express";
import { getSnippets, createSnippet, updateSnippet, deleteSnippet } from "../controllers/snippet.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", authMiddleware, getSnippets);
router.post("/", authMiddleware, createSnippet);
router.put("/:id", authMiddleware, updateSnippet);
router.delete("/:id", authMiddleware, deleteSnippet);
export default router;