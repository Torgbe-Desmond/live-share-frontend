import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  alpha,
  useTheme,
  Container,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { createUser } from "../api/userApi";
import socket from "../socket";

export default function CreatePlayground() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ─── Random Username Generator ───

  const nouns = useMemo(
    () => [
      "Panda",
      "Waffle",
      "Falcon",
      "Raven",
      "Tiger",
      "Phoenix",
      "Dragon",
      "Ninja",
      "Wizard",
      "Knight",
      "Samurai",
      "Pirate",
      "Ghost",
      "Shadow",
      "Bolt",
      "Spark",
      "Vortex",
      "Blaze",
      "Frost",
      "Echo",
      "Nova",
      "Pulse",
      "Rift",
      "Surge",
      "Zenith",
    ],
    [],
  );

  const adjectives = useMemo(
    () => [
      "Silent",
      "Cosmic",
      "Neon",
      "Shadow",
      "Golden",
      "Frosty",
      "Blazing",
      "Mystic",
      "Electric",
      "Velvet",
      "Quantum",
      "Lunar",
      "Solar",
      "Phantom",
      "Turbo",
      "Pixel",
      "Echo",
      "Nova",
      "Rogue",
      "Stealth",
      "Wild",
      "Rapid",
      "Dream",
      "Storm",
      "Vivid",
    ],
    [],
  );


  // Memoize the generator function
  const generateUsername = useCallback(() => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 900) + 10;
    return `${adj}${noun}${number}`;
  }, [adjectives,nouns]); // ← empty deps = function is created only once

  // Generate once on mount
  useEffect(() => {
    setUsername(generateUsername());
  }, [generateUsername]); // ← depend on the memoized function

  const handleCreate = async () => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError("");

      const response = await createUser(username.trim());
      const data = response.data;

      localStorage.setItem("userId", data.userId);
      localStorage.setItem("roomName", data.roomName);
      localStorage.setItem("username", username.trim()); // using the generated one

      socket.emit("joinRoom", {
        roomName: data.roomName,
        userId: data.userId,
        username: username.trim(),
      });

      navigate("/playground");
    } catch (err) {
      setError(err.message || "Failed to create playground");
    } finally {
      setLoading(false);
    }
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     handleCreate();
  //   }
  // };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
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

          {/* Generated Username Display */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 600, mb: 1.5 }}
            >
              Your Display Name
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={username || "Generating..."}
                color="primary"
                variant="outlined"
                size="medium"
                sx={{
                  fontSize: "1.1rem",
                  py: 2.5,
                  px: 3,
                  height: "auto",
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderWidth: 2,
                  "& .MuiChip-label": { px: 2 },
                }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => setUsername(generateUsername())}
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                Another Name
              </Button>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, fontSize: "0.85rem" }}
            >
              This will be your display name in the room
            </Typography>
          </Box>

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
