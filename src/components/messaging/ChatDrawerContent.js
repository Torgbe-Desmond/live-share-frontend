import { useState } from "react";
import {
  Drawer,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";

// You can later extract this to its own file
function ChatDrawerContent({ onClose }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: send message logic here
    console.log("Sending:", message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "100vw", sm: 380 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ChatBubbleOutlineIcon color="primary" />
          <Typography variant="h6">Chat</Typography>
        </Box>

        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages area */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Example messages — replace with real list */}
        {[
          { id: 1, sender: "You", text: "Hey everyone 👋", isOwn: true },
          { id: 2, sender: "Alex", text: "Yo! What's the plan?" },
          {
            id: 3,
            sender: "You",
            text: "Just chilling in the room",
            isOwn: true,
          },
        ].map((msg) => (
          <Box
            key={msg.id}
            sx={{
              alignSelf: msg.isOwn ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 2,
                borderTopRightRadius: msg.isOwn ? 0 : 8,
                borderTopLeftRadius: msg.isOwn ? 8 : 0,
                bgcolor: msg.isOwn ? "primary.main" : "grey.100",
                color: msg.isOwn ? "primary.contrastText" : "text.primary",
              }}
            >
              {!msg.isOwn && (
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                >
                  {msg.sender}
                </Typography>
              )}
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      <Divider />

      {/* Input area */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          minRows={1}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "background.paper",
            },
          }}
        />
      </Box>
    </Box>
  );
}


