// chatContext.js

import { createContext, useContext, useState, useEffect, useRef } from "react";
import socket from "../socket"; // adjust path as needed
import useSocketListeners from "../components/useSocketListeners"; // adjust path

const ChatContext = createContext(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

export function ChatProvider({ children }) {
  // ── Identity & room ─────────────────────────────────────────────
  const [senderId, setSenderId] = useState(null);
  const [username, setUsername] = useState(null);
  const [roomName, setRoomName] = useState(null);

  // ── Messages & participants ─────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(new Set());

  // ── Connection & UI state ───────────────────────────────────────
  const [isActive, setIsActive] = useState(true);
  const [showReconnect, setShowReconnect] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // ── Mobile drawer ───────────────────────────────────────────────
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // ── Notifications ───────────────────────────────────────────────
  const [leftMessage, setLeftMessage] = useState("");
  const [joinedMessage, setJoinedMessage] = useState("");

  // ── Reply feature ───────────────────────────────────────────────
  const [replyingTo, setReplyingTo] = useState(null);

  // ── Refs used in render ─────────────────────────────────────────
  const bottomRef = useRef(null);
  const messageRefs = useRef(new Map());

  // ── Socket listeners (shared) ───────────────────────────────────
  useSocketListeners(
    senderId,
    setMessages,
    users,
    setUsers,
    setLeftMessage,
    setJoinedMessage
  );

  // ── Reconnect logic ─────────────────────────────────────────────
  const attemptReconnect = () => {
    if (isReconnecting) return;

    setIsReconnecting(true);
    setRetryCount((prev) => prev + 1);

    const storedUserId = localStorage.getItem("userId");
    const storedRoomName = localStorage.getItem("roomName");
    const storedUsername = localStorage.getItem("username");

    if (!storedUserId || !storedRoomName || !storedUsername) {
      setIsReconnecting(false);
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", {
      roomName: storedRoomName,
      userId: storedUserId,
      username: storedUsername,
    });

    // Optional timeout fallback
    setTimeout(() => {
      if (!isActive) {
        setIsReconnecting(false);
      }
    }, 8000);
  };

  const handleSuccessfulConnection = () => {
    setIsActive(true);
    setShowReconnect(false);
    setIsReconnecting(false);
    setRetryCount(0);
  };

  // ── Auto-join on mount + socket events ──────────────────────────
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRoomName = localStorage.getItem("roomName");
    const storedUsername = localStorage.getItem("username");

    if (storedUserId && storedRoomName && storedUsername) {
      setSenderId(storedUserId);
      setRoomName(storedRoomName);
      setUsername(storedUsername);

      if (socket.connected) {
        socket.emit("joinRoom", {
          roomName: storedRoomName,
          userId: storedUserId,
          username: storedUsername,
        });
      }
    }
  }, []);

  useEffect(() => {
    const handleDisconnect = () => {
      setIsActive(false);
      setShowReconnect(true);
      setIsReconnecting(false);
    };

    const handleConnect = () => {
      handleSuccessfulConnection();
    };

    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleConnect);

    if (!socket.connected) {
      setShowReconnect(true);
      setIsActive(false);
    }

    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("connect", handleConnect);
    };
  }, []);

  // ── Auto-scroll ─────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handlers used in JSX ────────────────────────────────────────
  const handleLeaveRoom = () => {
    if (roomName && senderId) {
      socket.emit("leaveRoom", { roomName, userId: senderId, username });
    }
    localStorage.removeItem("roomName");
    localStorage.removeItem("userId");
    // navigate("/") ← keep navigate in Playground if needed
  };

  const handleMenuClick = () => {
    setMobileDrawerOpen(true);
  };

  // ── Context value ───────────────────────────────────────────────
  const value = {
    // identity
    senderId,
    setSenderId,
    username,
    setUsername,
    roomName,
    setRoomName,

    // data
    messages,
    setMessages,
    users,
    setUsers,

    // connection/ui
    isActive,
    setIsActive,
    showReconnect,
    setShowReconnect,
    isReconnecting,
    setIsReconnecting,
    retryCount,
    setRetryCount,

    // drawer
    mobileDrawerOpen,
    setMobileDrawerOpen,

    // notifications
    leftMessage,
    setLeftMessage,
    joinedMessage,
    setJoinedMessage,

    // reply
    replyingTo,
    setReplyingTo,

    // refs
    bottomRef,
    messageRefs,

    // actions
    attemptReconnect,
    handleLeaveRoom,
    handleMenuClick,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}