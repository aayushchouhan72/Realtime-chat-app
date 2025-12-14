import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReciverSocketId(userId) {
  return userSocketMap[String(userId)];
}

//   used to stor online users

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A User connected", socket.id);

  // support both query and auth for compatibility with different client versions
  const userId =
    socket.handshake.query?.userId || socket.handshake.auth?.userId;
  if (userId) userSocketMap[String(userId)] = socket.id;

  //io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
