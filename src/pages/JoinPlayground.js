import React, { useState, useRef } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyIcon from "@mui/icons-material/Key";
import { createUser } from "../api/userApi";
import socket from "../socket";

export default function JoinPlayground() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();

  // ─── OTP logic ───
  const codeLength = 6;
  const inputRefs = useRef([]);

  const handleCodeChange = (index) => (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const newCode = code.split("");
    newCode[index] = value;
    setCode(newCode.join(""));

    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index) => (e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, codeLength);
    setCode(pasted.padEnd(codeLength, ""));
    const nextFocus = Math.min(pasted.length, codeLength - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  // ─── Join logic ───
  const handleJoin = async () => {
    if (!username.trim() || code.length !== codeLength) return;

    try {
      setLoading(true);
      setError("");

      const response = await createUser(username.trim());
      const data = response.data;

      localStorage.setItem("userId", data.userId);
      localStorage.setItem("roomName", code);
      localStorage.setItem("username", username.trim());

      socket.emit("joinRoom", { roomName: code, userId: data.userId });

      navigate("/playground");
    } catch (err) {
      setError(err.message || "Failed to join playground");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && code.length === codeLength && username.trim()) {
      handleJoin();
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
          elevation={6}
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
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            },
          }}
        >
          {/* Icon + Title */}
          <Box sx={{ mb: 4 }}>
            <KeyIcon
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
              Join Playground
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Enter your username and the 6-digit code
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Username */}
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
            helperText="This will be visible to others in the room"
            FormHelperTextProps={{ sx: { mt: 1, fontSize: "0.8rem" } }}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.default",
              },
            }}
          />

          {/* OTP Input */}
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: 600, mb: 1.5 }}
          >
            Playground Code
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              mb: 4,
            }}
            onPaste={handlePaste}
          >
            {Array.from({ length: codeLength }).map((_, i) => (
              <TextField
                key={i}
                inputRef={(el) => (inputRefs.current[i] = el)}
                value={code[i] || ""}
                onChange={handleCodeChange(i)}
                onKeyDown={handleCodeKeyDown(i)}
                onFocus={(e) => e.target.select()}
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    height: "3.4rem",
                    padding: 0,
                  },
                }}
                sx={{
                  width: 64,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    bgcolor: code[i]
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "background.default",
                    "& fieldset": {
                      borderWidth: code[i] ? 2.5 : 1.5,
                      borderColor: code[i] ? "primary.main" : "divider",
                    },
                    "&:hover fieldset": { borderColor: "primary.main" },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                      borderWidth: 2.5,
                    },
                  },
                }}
                disabled={loading}
                autoFocus={i === 0}
              />
            ))}
          </Box>

          {/* Join Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!username.trim() || code.length !== codeLength || loading}
            onClick={handleJoin}
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
              "Join Playground"
            )}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Ask a friend for the code or check your messages
          </Typography>
        </Paper>
      </Container>

      {/* Animation */}
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
