import { io } from "socket.io-client";
const URL = "http://localhost:5000";
let socket;
export function getShifumiSocket() {
  if (!socket) {
    socket = io(URL, {
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return socket;
} 