import Snippet from "../models/snippet.model.js";
import User from "../models/user.model.js";

export const getSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSnippet = async (req, res) => {
  try {
    const { title, language, code, tags } = req.body;
    if (!title || !code) return res.status(400).json({ message: "Title and code required" });

    const snippet = await Snippet.create({ userId: req.user.id, title, language, code, tags });
    await User.findByIdAndUpdate(req.user.id, { $inc: { snippetCount: 1 } });

    res.status(201).json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!snippet) return res.status(404).json({ message: "Snippet not found" });
    await User.findByIdAndUpdate(req.user.id, { $inc: { snippetCount: -1 } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};