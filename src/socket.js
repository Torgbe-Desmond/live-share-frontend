// src/socket.js
import { io } from "socket.io-client";
import { API_BASE } from "./api/URI";

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
      userId: storedUserId || undefined, 
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
