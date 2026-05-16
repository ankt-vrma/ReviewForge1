import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    language: { type: String, default: "javascript" },
    code: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Snippet", snippetSchema);