import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

let socket = null;

export const connectSocket = (token) => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  if (!token) return null;

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
