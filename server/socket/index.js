import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// Holds the Socket.IO instance after initialization.
let io;

export const initSocket = (httpServer) => {
  // Initialize socket.io with CORS settings matching the client URL.
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authenticate each socket connection using a JWT token.
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        if (typeof next === "function") {
          return next(new Error("Unauthorized"));
        }
        return socket.disconnect(true);
      }

      const session = jwt.verify(token, process.env.JWT_SECRET);
      socket.session = session;
      if (typeof next === "function") next();
    } catch {
      if (typeof next === "function") {
        next(new Error("Unauthorized"));
      } else {
        socket.disconnect(true);
      }
    }
  });

  // Handle a successful socket connection.
  io.on("connection", (socket) => {
    const { userId, role } = socket.session;

    // Join rooms for the individual user and the user's role.
    // This makes it easy to emit events to a specific user or role group.
    socket.join(`user:${userId}`);
    socket.join(`role:${role}`);

    socket.on("disconnect", () => {
      // socket.io handles cleanup automatically when a client disconnects.
    });
  });

  return io;
};

// Return the initialized Socket.IO instance or throw if it has not been set up.
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
};
