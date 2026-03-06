import { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function VideoPreview({
  file,
  onRetry,
  showViewOnceToggle = false,
  onToggleViewOnce,
  restrictedViewOnce = false,
  onViewed,
}) {
  const [videoSrc, setVideoSrc] = useState("");
  const videoRef = useRef(null);
  const hasTriggeredView = useRef(false);

  // Generate video src
  useEffect(() => {
    let objectUrl;
    if (file.local && file.file instanceof File) {
      objectUrl = URL.createObjectURL(file.file);
      setVideoSrc(objectUrl);
    } else {
      setVideoSrc(file.path || "");
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Mark as viewed on first play
  useEffect(() => {
    if (!restrictedViewOnce || hasTriggeredView.current) return;

    const videoEl = videoRef.current; // ✅ capture ref value

    if (!videoEl) return;

    const handleFirstPlay = () => {
      if (!hasTriggeredView.current) {
        hasTriggeredView.current = true;
        onViewed?.();
      }
    };

    videoEl.addEventListener("play", handleFirstPlay, { once: true });

    return () => {
      videoEl.removeEventListener("play", handleFirstPlay);
    };
  }, [restrictedViewOnce, onViewed]);

  const isViewOnce = !!file?.viewOnce;

  return (
    <Box
      mt={1.2}
      borderRadius={2}
      overflow="hidden"
      position="relative"
      sx={{
        // border: file.isSuccess
        //   ? "2px solid #4caf50"
        //   : file.isFailed
        //   ? "2px solid #f44336"
        //   : "2px solid transparent",
        transition: "border 0.3s",
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        src={videoSrc || null}
        controls={!restrictedViewOnce}
        muted={restrictedViewOnce}
        loop={!restrictedViewOnce}
        autoPlay={restrictedViewOnce ? false : undefined}
        sx={{
          width: "100%",
          maxWidth: 400,
          maxHeight: 300,
          display: "block",
          borderRadius: 2,
          filter:
            isViewOnce || restrictedViewOnce
              ? "brightness(0.8) contrast(0.9)"
              : "none",
        }}
      />

      {/* Sender toggle (only if passed) */}
      {showViewOnceToggle && (
        <Tooltip
          title={
            isViewOnce
              ? "View once – recipient sees once"
              : "Normal – replay allowed"
          }
        >
          <IconButton
            size="small"
            onClick={() => onToggleViewOnce?.(file)}
            sx={{
              position: "absolute",
              top: 8,
              right: 48,
              bgcolor: isViewOnce ? "primary.main" : "rgba(255,255,255,0.85)",
              color: isViewOnce ? "#fff" : "text.primary",
              boxShadow: 1,
              "&:hover": {
                bgcolor: isViewOnce ? "primary.dark" : "#fff", // ✅ fixed
              },
            }}
          >
            <VisibilityOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* View once indicator */}
      {isViewOnce && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "rgba(0,0,0,0.65)",
            color: "#fff", // ✅ fixed
            borderRadius: 10,
            px: 1,
            py: 0.4,
            fontSize: "0.75rem",
          }}
        >
          <VisibilityOffIcon fontSize="inherit" />
          <Typography variant="inherit">1×</Typography>
        </Box>
      )}

      {/* Upload overlay */}
      {!file.isSuccess && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            zIndex: 10,
          }}
        >
          {file.isFailed ? (
            <IconButton
              onClick={() => onRetry?.(file)}
              sx={{
                color: "#fff", // ✅ fixed
                bgcolor: "rgba(0,0,0,0.4)",
              }}
            >
              <ReplayIcon />
            </IconButton>
          ) : (
            <CircularProgress
              size={36}
              sx={{ color: "#fff" }} // ✅ fixed
            />
          )}
        </Box>
      )}
    </Box>
  );
}
