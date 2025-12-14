import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/soket.js";

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Basic env validation to avoid silent failures in production
const requiredEnvs = ["MONGODB_URL"];
const missingEnvs = requiredEnvs.filter((k) => !process.env[k]);
if (missingEnvs.length) {
  console.error(
    "Missing required environment variables:",
    missingEnvs.join(", ")
  );
  console.error(
    "The server may fail to connect to external services without these."
  );
}

console.log(
  `Starting server with NODE_ENV=${
    process.env.NODE_ENV || "undefined"
  } on PORT=${PORT}`
);

/* ------------------ middlewares ------------------ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? true : "http://localhost:5173",
    credentials: true,
  })
);

/* ------------------ routes ------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* ------------------ serve frontend (if built) ------------------ */
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  console.log(
    "Frontend dist found — enabling static file serving from:",
    frontendDist
  );
  app.use(express.static(frontendDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  console.log("No frontend dist found at:", frontendDist);
}

/* ❌ REMOVE THIS — VERY IMPORTANT
app.get("/", (req, res) => {
  res.send("How are you ");
});
*/

/* ------------------ start server ------------------ */
server.listen(PORT, async () => {
  console.log("Server running on port", PORT);
  await connectDB();
});

/* ------------------ error handling ------------------ */
server.on("error", (err) => {
  console.error("Server error:", err);
  if (err?.code === "EADDRINUSE") {
    console.error(`Port ${PORT} already in use`);
    process.exit(1);
  }
});

// Global error handlers to ensure the process exits on fatal errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Recommended: perform cleanup here if needed
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  // Recommended: perform cleanup here if needed
  process.exit(1);
});
