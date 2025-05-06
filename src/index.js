import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
console.log("FETCHED PORT:" + PORT);

const __dirname = path.resolve();

process.on('uncaughtException', err => {
  console.error('TTTTTTTTTTARAK Uncaught Exception:', err);
});
process.on('unhandledRejection', reason => {
  console.error('TTTTTTTTTTARAK Unhandled Rejection:', reason);
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://purple-island-06cc68e00.6.azurestaticapps.net",
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

process.on('uncaughtException', err => {
  console.error('TTTTTTTTTTARAK Uncaught Exception:', err);
});
process.on('unhandledRejection', reason => {
  console.error('TTTTTTTTTTARAK Unhandled Rejection:', reason);
});
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
