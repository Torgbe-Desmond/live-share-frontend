// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://live-share-5bkp.onrender.com", {
  withCredentials: true,
});

export default socket;