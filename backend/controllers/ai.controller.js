import { generateResponse } from "../services/ai.service.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";

export const getReview = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    const response = await generateResponse(prompt);

    await Review.create({ userId: req.user.id, prompt, response });
    await User.findByIdAndUpdate(req.user.id, { $inc: { reviewCount: 1 } });

    res.json({ response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};