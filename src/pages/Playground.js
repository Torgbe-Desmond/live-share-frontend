import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  alpha,
  Button,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";

import { useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Playground() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [senderId, setSenderId] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState(new Set());
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ─── Load user & join room ───
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedRoomName = localStorage.getItem("roomName");
    const storedUsername = localStorage.getItem("username");

    setSenderId(storedUserId);
    setRoomName(storedRoomName);
    setUsername(storedUsername);

    if (storedRoomName && storedUserId) {
      socket.emit("joinRoom", {
        roomName: storedRoomName,
        userId: storedUserId,
      });
    }
  }, []);

  // ─── Socket listeners ───
  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
      if (data.username) {
        setUsers((prev) => new Set([...prev, data.username]));
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Send message ───
  const handleSend = () => {
    if (!senderId || !roomName) return;
    if (!message.trim() && selectedFiles.length === 0) return;

    socket.emit("sendMessage", {
      content: message.trim(),
      sender_id: senderId,
      roomName,
      username,
    });

    setMessage("");
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", { roomName, userId: senderId });
    localStorage.removeItem("roomName");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // ─── Message Bubble ───
  const MessageBubble = ({ msg }) => {
    const isOwn = msg.sender_id === senderId;

    return (
      <ListItem
        sx={{
          px: 0,
          py: 0.5,
          justifyContent: isOwn ? "flex-end" : "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isOwn ? "row-reverse" : "row",
            alignItems: "flex-end",
            gap: 1.2,
            maxWidth: "80%",
          }}
        >
          <Avatar
            src={`https://robohash.org/${msg.username}?set=set4`}
            sx={{
              width: 36,
              height: 36,
              bgcolor: isOwn ? "primary.dark" : "grey.400",
            }}
          />
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 3,
              borderTopRightRadius: isOwn ? 0 : 12,
              borderTopLeftRadius: isOwn ? 12 : 0,
              bgcolor: isOwn ? "primary.main" : alpha("#fff", 0.98),
              color: isOwn ? "primary.contrastText" : "text.primary",
              boxShadow: isOwn
                ? "0 4px 12px rgba(25,118,210,0.28)"
                : "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, opacity: 0.8, mb: 0.4, display: "block" }}
            >
              {msg.username}
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
              {msg.content}
            </Typography>
            {msg.files?.map((url, i) => (
              <Box key={i} mt={1.2} borderRadius={2} overflow="hidden">
                <img
                  src={url}
                  alt="attachment"
                  style={{ maxWidth: "100%", display: "block" }}
                />
              </Box>
            ))}
          </Paper>
        </Box>
      </ListItem>
    );
  };

  // ─── Sidebar Content ───
  const SidebarContent = () => (
    <Box
      sx={{
        width: 280,
        height: "100%",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Users list */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PeopleIcon fontSize="small" /> Online ({users.size})
        </Typography>

        <List disablePadding>
          {username && (
            <ListItem
              sx={{ borderRadius: 1, bgcolor: alpha("#1976d2", 0.08), mb: 0.5 }}
            >
              <ListItemAvatar>
                <Avatar
                  src={`https://robohash.org/${username}?set=set4`}
                  sx={{ bgcolor: "primary.dark" }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={username}
                primaryTypographyProps={{ fontWeight: 600 }}
                secondary="You"
              />
            </ListItem>
          )}

          {[...users].map((user) =>
            user !== username ? (
              <ListItem key={user} sx={{ borderRadius: 1 }}>
                <ListItemAvatar>
                  <Avatar src={`https://robohash.org/${user}?set=set4`} />
                </ListItemAvatar>
                <ListItemText primary={user} />
              </ListItem>
            ) : null,
          )}
        </List>
      </Box>

      {/* Footer actions */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLeaveRoom}
          sx={{ borderRadius: 2 }}
        >
          Leave Room
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: "100dvh", display: "flex", overflow: "hidden" }}>
      {/* Sidebar - permanent on desktop, drawer on mobile */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: 280 } }}
        >
          <SidebarContent />
        </Drawer>
      ) : (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <SidebarContent />
        </Box>
      )}

      {/* Main content */}
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "" }}
      >
        {/* Top App Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Toolbar
            variant="dense"
            sx={{ minHeight: 56, px: { xs: 2, sm: 3 }, gap: 2 }}
          >
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileDrawerOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={700}
              noWrap
              sx={{ letterSpacing: "-0.02em" }}
            >
              Playground
            </Typography>

            {roomName && (
              <Box
                component="span"
                sx={{
                  px: 1.5,
                  py: 0.4,
                  borderRadius: 10,
                  bgcolor: "action.hover",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                @{roomName}
              </Box>
            )}

            <Box sx={{ flex: 1 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  boxShadow: "0 0 0 3px rgba(76,175,80,0.2)",
                }}
              />
              <Typography variant="body2" fontWeight={500}>
                {users.size} active
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Messages Area */}
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
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id ?? Date.now() + Math.random()}
                msg={msg}
              />
            ))}
            <div ref={bottomRef} />
          </List>
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
          />

          <TextField
            fullWidth
            size="medium"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "background.default",
              },
            }}
          />

          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!message.trim() && selectedFiles.length === 0}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
