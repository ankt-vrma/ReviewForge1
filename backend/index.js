import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import aiRoutes from "./routes/ai.route.js";
import snippetRoutes from "./routes/snippet.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Queens backend live at http://localhost:${process.env.PORT}`);
});