import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Badge,
  Button,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";

const CHAT_WIDTH = 320;
const CHAT_GAP = 12;
const MAX_VISIBLE_CHATS = 2;

export default function DockedChatWindows({ chats = [], onClose }) {
  const [minimized, setMinimized] = useState({});
  const [chatState, setChatState] = useState(chats);
  const messagesEndRefs = useRef({});

  useEffect(() => {
    setChatState(chats);
  }, [chats]);

  useEffect(() => {
    chatState.forEach((chat) => {
      messagesEndRefs.current[chat.id]?.scrollIntoView({ behavior: "smooth" });
    });
  }, [chatState]);

  const visibleChats = chatState.slice(0, MAX_VISIBLE_CHATS);
  const hiddenChats = chatState.slice(MAX_VISIBLE_CHATS);

  const toggleMinimize = (id) => {
    setMinimized((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClose = (id) => {
    if (onClose) onClose(id);
    setChatState((prev) => prev.filter((c) => c.id !== id));
    setMinimized((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSendMessage = (chatId, text) => {
    if (!text.trim()) return;
    setChatState((prev) =>
      prev.map((chat) =>
        chat.id !== chatId
          ? chat
          : {
              ...chat,
              messages: [
                ...chat.messages,
                { id: Date.now().toString(), text, sender: "me", isViewed: true },
              ],
            }
      )
    );
  };

  const getUnreadCount = (chat) =>
    chat.messages.filter((m) => !m.isViewed && m.sender !== "me").length;

  const showHiddenChat = (chatId) => {
    const hiddenIndex = chatState.findIndex((c) => c.id === chatId);
    if (hiddenIndex === -1) return;

    setChatState((prev) => {
      const newChats = [...prev];
      const [hiddenChat] = newChats.splice(hiddenIndex, 1);
      newChats.splice(MAX_VISIBLE_CHATS - 1, 0, hiddenChat);
      return newChats;
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 85,
        right: 16,
        display: "flex",
        alignItems: "flex-end",
        gap: `${CHAT_GAP}px`,
        zIndex: 1300,
      }}
    >
      {/* + more indicator */}
      {hiddenChats.length > 0 && (
        <Badge badgeContent={hiddenChats.length} color="primary">
          <Paper elevation={4} sx={{ px: 2, py: 1 }}>
            <Typography variant="body2">+{hiddenChats.length} more</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", mt: 1, gap: 0.5 }}>
              {hiddenChats.map((chat) => {
                const unread = getUnreadCount(chat);
                return (
                  <Button
                    key={chat.id}
                    size="small"
                    variant="outlined"
                    onClick={() => showHiddenChat(chat.id)}
                  >
                    {chat.title}
                    {unread > 0 && ` (${unread})`}
                  </Button>
                );
              })}
            </Box>
          </Paper>
        </Badge>
      )}

      {/* Minimized chats – shown as small buttons */}
      {chatState.map(
        (chat) =>
          minimized[chat.id] && (
            <Badge
              key={chat.id}
              badgeContent={getUnreadCount(chat)}
              color="error"
              invisible={getUnreadCount(chat) === 0}
            >
              <Button
                size="small"
                variant="outlined"
                onClick={() => toggleMinimize(chat.id)}
              >
                {chat.title}
              </Button>
            </Badge>
          )
      )}

      {/* Expanded chat windows only */}
      <AnimatePresence>
        {visibleChats.map((chat) => {
          // Only render full window when NOT minimized
          if (minimized[chat.id]) return null;

          const unread = getUnreadCount(chat);

          return (
            <motion.div
              key={chat.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Paper
                elevation={6}
                sx={{
                  width: CHAT_WIDTH,
                  display: "flex",
                  flexDirection: "column",
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  overflow: "hidden",
                }}
              >
                {/* Header – only shown when expanded */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 1.5,
                    py: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <Typography variant="subtitle2" noWrap>
                    {chat.title}
                    {unread > 0 && ` (${unread})`}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => toggleMinimize(chat.id)}
                      sx={{ color: "inherit" }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleClose(chat.id)}
                      sx={{ color: "inherit" }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages + input */}
                <Box sx={{ display: "flex", flexDirection: "column", height: 300 }}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      overflowY: "auto",
                      bgcolor: "background.default",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {chat.messages.map((msg) => (
                      <Box
                        key={msg.id}
                        sx={{
                          alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
                          bgcolor: msg.sender === "me" ? "primary.main" : "grey.300",
                          color: msg.sender === "me" ? "primary.contrastText" : "black",
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 2,
                          mb: 1,
                          maxWidth: "75%",
                          wordBreak: "break-word",
                        }}
                      >
                        <Typography variant="body2">{msg.text}</Typography>
                      </Box>
                    ))}
                    <div ref={(el) => (messagesEndRefs.current[chat.id] = el)} />
                  </Box>

                  <Box sx={{ p: 1, borderTop: 1, borderColor: "divider" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      variant="outlined"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(chat.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Box>
  );
}

// Demo (unchanged)
export function ChatDemo() {
  const initialChats = [
    {
      id: "1",
      title: "John Doe",
      messages: [
        { id: "a", text: "Hey!", sender: "them", isViewed: false },
        { id: "b", text: "Hi John 👋", sender: "me", isViewed: true },
      ],
    },
    {
      id: "2",
      title: "Jane Smith",
      messages: [{ id: "c", text: "Are we meeting today?", sender: "them", isViewed: false }],
    },
    {
      id: "3",
      title: "Product Team",
      messages: [{ id: "d", text: "Sprint starts tomorrow.", sender: "them", isViewed: false }],
    },
     {
      id: "4",
      title: "Product Team",
      messages: [{ id: "d", text: "Sprint starts tomorrow.", sender: "them", isViewed: false }],
    },
     {
      id: "5",
      title: "Product Team",
      messages: [{ id: "d", text: "Sprint starts tomorrow.", sender: "them", isViewed: false }],
    },
  ];

  const [chats, setChats] = useState(initialChats);
  const handleClose = (id) => setChats((prev) => prev.filter((c) => c.id !== id));

  return <DockedChatWindows chats={chats} onClose={handleClose} />;
}