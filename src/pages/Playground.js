import { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  Drawer,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import socket from "../socket";
import SidebarContent from "../components/SidebarContent";
import ChatHeader from "../components/ChatHeader";
import MessageBubble from "../components/messaging/MessageBubble";
import MessageInput from "../components/messaging/MessageInput";
import { uploadFile } from "../api/fileApi";
import useSocketListeners from "../components/useSocketListeners";

export default function Playground() {
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
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isActive, setIsActive] = useState(true);
  const messageRefs = useRef(new Map());
  // ─── Load stored data & join room ───────────────────────────────

  useEffect(() => {
    const handleDisconnect = (reason) => {
      setIsActive(false);
      // console.log("Socket disconnected:", reason);
      // Reason can be: "io server disconnect", "io client disconnect", "ping timeout", etc.
    };

    const handleConnect = () => {
      const storedUserId = localStorage.getItem("userId");
      const storedRoomName = localStorage.getItem("roomName");
      const storedUsername = localStorage.getItem("username");

      socket.emit("joinRoom", {
        roomName: storedRoomName,
        userId: storedUserId,
        username: storedUsername, 
      });
      
      setIsActive(true);

    };

    const handleReconnectAttempt = (attempt) => {
      // console.log("Reconnecting attempt:", attempt);
    };

    // Listen to socket events
    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleConnect);
    socket.on("reconnect_attempt", handleReconnectAttempt);

    // Clean up on unmount
    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("connect", handleConnect);
      socket.off("reconnect_attempt", handleReconnectAttempt);
    };
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRoomName = localStorage.getItem("roomName");
    const storedUsername = localStorage.getItem("username");

    if (storedUserId && storedRoomName && storedUsername) {
      setSenderId(storedUserId);
      setRoomName(storedRoomName);
      setUsername(storedUsername);

      socket.emit("joinRoom", {
        roomName: storedRoomName,
        userId: storedUserId,
        username: storedUsername, // send username too if backend expects it
      });
    }
  }, []);

  useSocketListeners(
    senderId,
    setMessages,
    users,
    setUsers,
    setLeftMessage,
    setJoinedMessage,
  );

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Actions ────────────────────────────────────────────────────

  // Upload function per file or just text
  const uploadFileHandler = async (formData, localMessageId = null) => {
    try {
      const { success, data: backendMessage } = await uploadFile(formData);

      if (success && localMessageId) {
        // Replace the local message draft with the backend message
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.messageId === localMessageId ? backendMessage : msg,
          ),
        );
      }
    } catch (err) {
      if (localMessageId) {
        // Mark files in the local draft as failed
        setMessages((prevMessages) =>
          prevMessages.map((msg) => {
            if (msg.messageId === localMessageId) {
              return {
                ...msg,
                files: msg.files.map((f) => ({
                  ...f,
                  isFailed: true,
                })),
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
        if (msg.id !== messageId) return msg; // you'll need a unique msg.id

        return {
          ...msg,
          files: msg.files?.map((f) =>
            f.publicId === filePublicId ? { ...f, viewed: true } : f,
          ),
        };
      }),
    );
  };
  // Optional: emit socket event so sender knows it was viewed
  // socket.emit("mediaViewed", { messageId, filePublicId, roomName });

  const handleSend = async () => {
    if (!senderId || !roomName) return;
    if (!message.trim() && selectedFiles.size === 0) return;

    const selectedFile = [...selectedFiles][0]; // only one

    const messageId = Date.now();
    const targetId = messageId.toString();
    // Local UI object
    const localMessageObject = {
      messageId: targetId,
      content: message.trim(),
      senderId,
      roomName,
      username,
      replyTo: replyingTo
        ? {
            messageId: replyingTo.messageId || "",
            content: replyingTo.content,
            username: replyingTo.username,
            files: replyingTo?.files ? replyingTo?.files : [],
          }
        : null,
      files: selectedFile ? [selectedFile] : [],
    };

    setMessages((prev) => [...prev, localMessageObject]);

    // Payload to server
    const formData = new FormData();
    formData.append("content", message.trim());
    formData.append("senderId", senderId);
    formData.append("roomName", roomName);
    formData.append("username", username);
    formData.append("messageId", messageId.toString());

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

    await uploadFileHandler(
      formData,
      localMessageObject.messageId,
      replyingTo ? true : false,
    );
    // Clear state
    setMessage("");
    setReplyingTo(null);
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

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <Box sx={{ height: "100dvh", display: "flex", overflow: "hidden" }}>
      {/* Sidebar – drawer on mobile, static on desktop */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: 280 } }}
        >
          <SidebarContent
            users={users}
            username={username}
            onLeaveRoom={handleLeaveRoom}
          />
        </Drawer>
      ) : (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <SidebarContent
            users={users}
            username={username}
            onLeaveRoom={handleLeaveRoom}
          />
        </Box>
      )}

      {/* Main chat area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatHeader
          roomName={roomName}
          usersCount={users.size}
          isMobile={isMobile}
          onMenuClick={() => setMobileDrawerOpen(true)}
          isActive={isActive}
        />

        {/* Messages list */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            pb: 3,
            display: "flex",
            cursor: "pointer",
            flexDirection: "column",
          }}
        >
          <List disablePadding sx={{ mt: "auto" }}>
            {messages.map((msg, index) => (
              <MessageBubble
                key={`${msg.senderId}-${index}`}
                msg={msg}
                senderId={senderId}
                onReply={setReplyingTo}
                onMediaViewed={(filePublicId) =>
                  markFileAsViewed(msg.messageId, filePublicId)
                }
                onClicReply={(replyMsg) => {
                  if (replyMsg.replyTo?.messageId) {
                    const originalRef = messageRefs.current.get(
                      replyMsg.replyTo.messageId,
                    );
                    originalRef?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
                ref={(el) => {
                  if (el) messageRefs.current.set(msg.messageId, el);
                }}
              />
            ))}
            <div ref={bottomRef} />
          </List>
        </Box>

        {/* Input area */}
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={handleSend}
          fileInputRef={fileInputRef}
          selectedFilesCount={selectedFiles.size}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />

        {/* Notifications */}
        <Snackbar
          sx={{ marginTop: 1 }}
          open={Boolean(leftMessage)}
          autoHideDuration={4000}
          onClose={() => setLeftMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setLeftMessage("")} severity="warning">
            {leftMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(joinedMessage)}
          autoHideDuration={4000}
          onClose={() => setJoinedMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setJoinedMessage("")} severity="info">
            {joinedMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
