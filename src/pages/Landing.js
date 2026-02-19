import React from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  

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
            // subtle gradient accent
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
          {/* Logo / Title */}
          <Box sx={{ mb: 4 }}>
            <RocketLaunchIcon
              sx={{
                fontSize: 64,
                color: "primary.main",
                mb: 2,
                animation: "float 3s ease-in-out infinite",
              }}
            />
            <Typography
              variant="h4"
              fontWeight={800}
              color="text.primary"
              gutterBottom
              sx={{
                letterSpacing: "-0.02em",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Playground
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Create or join real-time chat rooms with friends
            </Typography>
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate("/create")}
              startIcon={<RocketLaunchIcon />}
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
              Create New Playground
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate("/join")}
              startIcon={<GroupAddIcon />}
              sx={{
                py: 1.8,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              Join Existing Playground
            </Button>
          </Box>

          {/* Optional subtle footer text */}
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ mt: 4, display: "block" }}
          >
            Real-time • Simple • Fun
          </Typography>
        </Paper>
      </Container>

      {/* Floating animation keyframe */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
        `}
      </style>
    </Box>
  );
}