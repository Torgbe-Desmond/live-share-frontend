// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://127.20.10.2:5000", {
  withCredentials: true,
});

export default socket;