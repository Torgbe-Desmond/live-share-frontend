import React, { useState, useEffect, useRef } from "react";
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
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

export default function Playground() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [senderId, setSenderId] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState(new Set()); // usernames only (strings)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [leftMessage, setLeftMessage] = useState("");
  const [joinedMessage, setJoinedMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ─── Load stored data & join room ───────────────────────────────
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

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
      const sum = { userId: data.senderId, username: data.username };
      handleUserJoin(sum);
    };

    const handleUserLeft = (data) => {
      if (data.username) {
        setUsers((prevUsers) => {
          if (!prevUsers.has(data.username)) return prevUsers;

          const updatedUsers = new Set(prevUsers);
          updatedUsers.delete(data.username);
          setLeftMessage(`${data.username} has left the room`);
          return updatedUsers;
        });
      }
    };

    const handleUserJoin = (data) => {
      if (!data.username || data.userId === senderId?.toString()) return;

      setUsers((prevUsers) => {
        if (prevUsers.has(data.username)) return prevUsers;

        const updatedUsers = new Set(prevUsers);
        updatedUsers.add(data.username);
        setJoinedMessage(`${data.username} has joined the room`);
        return updatedUsers;
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("userLeft", handleUserLeft);
    socket.on("userJoined", handleUserJoin);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("userLeft", handleUserLeft);
      socket.off("userJoined", handleUserJoin); // ✅ important
    };
  }, [senderId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Actions ────────────────────────────────────────────────────
  const handleSend = () => {
    if (!senderId || !roomName) return;
    if (!message.trim() && selectedFiles.length === 0) return;

    socket.emit("sendMessage", {
      content: message.trim(),
      senderId,
      roomName,
      username,
      replyTo: replyingTo
        ? {
            content: replyingTo?.content,
            username: replyingTo?.username,
          }
        : null,
    });

    setMessage("");
    setSelectedFiles([]);
    setReplyingTo(null)
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
          selectedFilesCount={selectedFiles.length}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
        />

        {/* Notifications */}
        <Snackbar
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
