// src/socket.js
import { io } from "socket.io-client";

const API_BASE =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://live-share-5bkp.onrender.com"
    : "http://127.20.10.2:5000";

// You can make this dynamic if needed
const getSocketOptions = () => {
  const storedUserId = localStorage.getItem("userId");
  const storedRoomName = localStorage.getItem("roomName");
  const storedUsername = localStorage.getItem("username");

  return {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: {
      userId: storedUserId || undefined, // will be ignored if undefined
      roomName: storedRoomName || undefined,
      username: storedUsername || undefined,
      // you can add anything else you want
      // device: "web",
      // appVersion: "1.2.3",
      // role: "student",
    },
  };
};

const socket = io(API_BASE, getSocketOptions());

export default socket;
