// src/socket.js
import { io } from "socket.io-client";
const API_BASE =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://live-share-5bkp.onrender.com"
    : "http://127.20.10.2:5000";

const socket = io(API_BASE, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
});

export default socket;
