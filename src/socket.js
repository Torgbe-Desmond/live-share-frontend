// src/socket.js
import { io } from "socket.io-client";
const BASE_URL = ["https://live-share-5bkp.onrender.com","http://localhost:5000"][1];

const socket = io(BASE_URL, {
  withCredentials: true,
});

export default socket;