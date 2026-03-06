import { useState } from "react";
import {
  Box,
  useTheme,
  useRef,
  List,
  Drawer,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

import SidebarContent from "../components/sidebar/SidebarContent";
import ChatHeader from "../components/header/ChatHeader";

export default function ChatLayout() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [senderId, setSenderId] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState(new Set());
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [leftMessage, setLeftMessage] = useState("");
  const [joinedMessage, setJoinedMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [showReconnect, setShowReconnect] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const messageRefs = useRef(new Map());
  const reconnectTimeoutRef = useRef(null);

  // ─── Reconnect logic ────────────────────────────────────────────────

  useSocketListeners(
    senderId,
    setMessages,
    users,
    setUsers,
    setLeftMessage,
    setJoinedMessage,
  );
e
  const attemptReconnect = () => {
    if (isReconnecting) return;

    setIsReconnecting(true);
    setRetryCount((prev) => prev + 1);

    const storedUserId = localStorage.getItem("userId");
    const storedRoomName = localStorage.getItem("roomName");
    const storedUsername = localStorage.getItem("username");

    if (!storedUserId || !storedRoomName || !storedUsername) {
      setIsReconnecting(false);
      // Optionally show error: "Missing credentials"
      return;
    }

    // Force socket reconnection if needed
    if (!socket.connected) {
      socket.connect();
    }

    // Re-join the room
    socket.emit("joinRoom", {
      roomName: storedRoomName,
      userId: storedUserId,
      username: storedUsername,
    });

    // Timeout: if no real success after 8 seconds → show button again
    reconnectTimeoutRef.current = setTimeout(() => {
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

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const handleDisconnect = (reason) => {
      setIsActive(false);
      setShowReconnect(true);
      setIsReconnecting(false);
      // console.log("Socket disconnected:", reason);
    };

    const handleConnect = () => {
      // Real connection established → consider success (for now)
      // If your backend sends "joinSuccess" or similar → move logic there
      handleSuccessfulConnection();
    };

    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleConnect);

    // Optional stronger confirmation (recommended if backend supports it):
    // socket.on("joinSuccess", handleSuccessfulConnection);
    // socket.on("joinError", (err) => {
    //   setIsReconnecting(false);
    //   // show snackbar: "Join failed: " + err.message
    // });

    // Initial state check
    if (!socket.connected) {
      setShowReconnect(true);
      setIsActive(false);
    }

    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("connect", handleConnect);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Load stored data and auto-join if already connected
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

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Send message / upload logic ────────────────────────────────────
  const uploadFileHandler = async (formData, localMessageId = null) => {
    try {
      const { success, data: backendMessage } = await uploadFile(formData);

      if (success && localMessageId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.messageId === localMessageId ? backendMessage : msg,
          ),
        );
      }
    } catch (err) {
      if (localMessageId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.messageId === localMessageId) {
              return {
                ...msg,
                files: msg.files?.map((f) => ({ ...f, isFailed: true })) || [],
              };
            }
            return msg;
          }),
        );
      }
    }
  };

  const markFileAsViewed = (messageId, filePublicId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.messageId !== messageId) return msg;

        return {
          ...msg,
          files: msg.files?.map((f) =>
            f.publicId === filePublicId ? { ...f, viewed: false } : f,
          ),
        };
      }),
    );
  };

  const handleSend = async () => {
    if (!senderId || !roomName) return;
    if (!message.trim() && selectedFiles.size === 0) return;

    const selectedFile = [...selectedFiles][0];

    const messageId = Date.now().toString();
    const localMessageObject = {
      messageId,
      content: message.trim(),
      senderId,
      roomName,
      username,
      replyTo: replyingTo
        ? {
            messageId: replyingTo.messageId || "",
            content: replyingTo.content,
            username: replyingTo.username,
            files: replyingTo?.files || [],
          }
        : null,
      files: selectedFile ? [selectedFile] : [],
    };

    setMessages((prev) => [...prev, localMessageObject]);

    const formData = new FormData();
    formData.append("content", message.trim());
    formData.append("senderId", senderId);
    formData.append("roomName", roomName);
    formData.append("username", username);
    formData.append("messageId", messageId);

    if (selectedFile) {
      formData.append("file", selectedFile.file);
    }

    if (replyingTo) {
      formData.append(
        "replyTo",
        JSON.stringify({
          content: replyingTo.content,
          username: replyingTo.username,
          files: replyingTo.files || [],
          messageId: replyingTo.messageId,
        }),
      );
    }

    setSelectedFiles(new Set());
    setReplyingTo(null);
    setMessage("");

    await uploadFileHandler(formData, messageId);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLeaveRoom = () => {
    if (roomName && senderId) {
      socket.emit("leaveRoom", { roomName, userId: senderId, username });
    }
    localStorage.removeItem("roomName");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <Box sx={{ height: "100dvh", display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: 280 } }}
        >
          <SidebarContent
            users={users}
            roomName={roomName}
            username={username}
            onLeaveRoom={onLeaveRoom}
          />
        </Drawer>
      ) : (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <SidebarContent
            users={users}
            roomName={roomName}
            username={username}
            onLeaveRoom={onLeaveRoom}
          />
        </Box>
      )}

      {/* Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatHeader
          isMobile={isMobile}
          onMenuClick={() => setMobileDrawerOpen(true)}
          isActive={isActive}
        />

        {/* Page content renders here */}
        <Outlet />
      </Box>
    </Box>
  );
}
