import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  alpha,
  useTheme,
  Container,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { createUser } from "../api/userApi";
import socket from "../socket";

export default function CreatePlayground() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleCreate = async () => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError("");

      const response = await createUser(username.trim());
      const data = response.data;

      localStorage.setItem("userId", data.userId);
      localStorage.setItem("roomName", data.roomName);
      localStorage.setItem("username", data.username);

      socket.emit("joinRoom", {
        roomName: data.roomName,
        userId: data.userId,
      });
      if (response) navigate("/playground");
    } catch (err) {
      setError(err.message || "Failed to create playground");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && username.trim()) {
      handleCreate();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={isMobile ? 0 : 3}
          sx={{
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "background.paper",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: isMobile
                ? ""
                : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            },
          }}
        >
          {/* Icon + Title */}
          <Box sx={{ mb: 4 }}>
            <AddCircleOutlineIcon
              sx={{
                fontSize: 64,
                color: "primary.main",
                mb: 2,
                animation: "float 3.5s ease-in-out infinite",
              }}
            />
            <Typography
              variant="h5"
              fontWeight={800}
              gutterBottom
              sx={{
                letterSpacing: "-0.02em",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create Playground
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Start your own real-time chat room
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Your Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
            autoFocus
            placeholder="e.g. DesmondTheCoder"
            helperText="This will be your display name in the room"
            FormHelperTextProps={{
              sx: { mt: 1, fontSize: "0.8rem" },
            }}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.default",
              },
            }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!username.trim() || loading}
            onClick={handleCreate}
            sx={{
              py: 1.8,
              borderRadius: 3,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: "translateY(-2px)",
                transition: "all 0.2s ease",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={28} color="inherit" />
            ) : (
              "Create & Join"
            )}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            You'll get a unique 6-digit code to share instantly
          </Typography>
        </Paper>
      </Container>

      {/* Floating animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }
        `}
      </style>
    </Box>
  );
}
