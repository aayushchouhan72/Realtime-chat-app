import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import messageRoutes from "./routes/message.route.js";
import { app, server, io } from "./lib/soket.js";

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("How are you ");
});

server.listen(PORT, () => {
  console.log("Server is running at Port", PORT);
  connectDB();
});

// handle server errors (e.g., port already in use)
server.on("error", (err) => {
  console.error("Server error:", err);
  if (err && err.code === "EADDRINUSE") {
    console.error(`Port ${process.env.PORT} already in use.`);
    process.exit(1);
  }
});
