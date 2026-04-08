import {
  Box,
  CircularProgress,
  IconButton,
  Slider,
  Stack,
  Typography,
  Fade,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function VideoContent({
  videoRef,
  url,
  title,
  file,
  isPlaying,
  isMuted,
  isLoading,
  isBuffering,
  currentTime,
  duration,
  fullscreen,
  onPlayPause,
  onToggleMute,
  onToggleFullscreen,
  onSeek,
  onClose,
  showControls = true,
}) {
  const containerRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideTimer = useRef(null);

  const handleToggleFullscreen = () => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container) return;

    // Desktop fullscreen
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => { });
      } else {
        document.exitFullscreen().catch(() => { });
      }
    }
    // 📱 Mobile fallback (especially iOS)
    else if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => { });
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iOS Safari
      }
    }

    onToggleFullscreen?.();
  };

  const showControlsTemporarily = () => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying) setControlsVisible(false);
    }, 2800);
  };

  const handleContainerClick = () => {
    onPlayPause();
    showControlsTemporarily();
  };

  const fileName = file?.originalname || file?.name || "attachment";

  const handleDownload = async () => {
    if (!url) return;

    try {
      // 1. Fetch the file data
      const response = await fetch(url);
      const blob = await response.blob();

      // 2. Create a local URL for the blob data
      const file_url = window.URL.createObjectURL(blob);

      // 3. Create the temporary link
      const link = document.createElement("a");
      link.href = file_url;
      link.download = fileName; // Now the browser WILL respect this

      document.body.appendChild(link);
      link.click();

      // 4. Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(file_url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: try opening in new tab if fetch fails (CORS issue)
      window.open(url, "_blank");
    }
  };

  return (
    <Box
      ref={containerRef}
      onMouseMove={showControlsTemporarily}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: fullscreen ? "100%" : 400,
        aspectRatio: fullscreen ? "unset" : "16/9",
        height: fullscreen ? "100vh" : "auto",
        bgcolor: "#000",
        borderRadius: fullscreen ? 0 : 2,
        overflow: "hidden",
        cursor: "pointer",
        mx: "auto",
        userSelect: "none",
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={url}
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onClick={handleContainerClick}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fullscreen ? "contain" : "cover",
          display: "block",
        }}
      />

      {/* Close button (fullscreen / modal mode) */}
      {onClose && (
        <Fade in>
          <IconButton
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 30,
              bgcolor: "rgba(0,0,0,0.55)",
              color: "#fff",
              backdropFilter: "blur(6px)",
              width: 32,
              height: 32,
              "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Fade>
      )}

      {/* Buffering / loading spinner */}
      <Fade in={isLoading || isBuffering}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={26} thickness={3} sx={{ color: "#fff" }} />
          </Box>
        </Box>
      </Fade>

      {/* Centre play/pause flash */}
      {showControls && (
        <Fade in={!isPlaying && !isLoading && !isBuffering} timeout={200}>
          <Box
            onClick={handleContainerClick}
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              pointerEvents: !isPlaying ? "auto" : "none",
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid rgba(255,255,255,0.18)",
                transition: "transform 0.15s ease",
                "&:hover": { transform: "scale(1.08)" },
              }}
            >
              <PlayArrowIcon sx={{ color: "#fff", fontSize: 28, ml: "2px" }} />
            </Box>
          </Box>
        </Fade>
      )}

      {/* Controls bar */}
      {showControls && (
        <Fade in={controlsVisible || !isPlaying} timeout={300}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              px: 1.5,
              pt: 6,
              pb: 1.2,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
            }}
          >
            {/* Progress slider */}
            <Slider
              size="small"
              value={currentTime}
              min={0}
              max={duration || 1}
              step={0.1}
              onChange={(_, value) => onSeek(value)}
              sx={{
                color: "#fff",
                height: 3,
                p: "6px 0",
                mb: 0.5,
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  transition: "transform 0.1s",
                  "&:hover": { transform: "scale(1.4)" },
                  "&.Mui-focusVisible": {
                    boxShadow: "0 0 0 6px rgba(255,255,255,0.18)",
                  },
                },
                "& .MuiSlider-track": { border: "none" },
                "& .MuiSlider-rail": { opacity: 0.3, bgcolor: "#fff" },
              }}
            />

            {/* Bottom row: buttons + time */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {/* Play / Pause */}
                <IconButton
                  onClick={onPlayPause}
                  size="small"
                  sx={{ color: "#fff", p: 0.6 }}
                >
                  {isPlaying
                    ? <PauseIcon sx={{ fontSize: 20 }} />
                    : <PlayArrowIcon sx={{ fontSize: 20 }} />}
                </IconButton>

                {/* Mute */}
                <IconButton
                  onClick={onToggleMute}
                  size="small"
                  sx={{ color: "#fff", p: 0.6 }}
                >
                  {isMuted
                    ? <VolumeOffIcon sx={{ fontSize: 18 }} />
                    : <VolumeUpIcon sx={{ fontSize: 18 }} />}
                </IconButton>

                {/* Download button */}
                <IconButton
                  size="small"
                  onClick={handleDownload}
                  sx={{ p: 0.6 }}

                >
                  <DownloadIcon sx={{ fontSize: 18 }} />
                </IconButton>

                {/* Timestamp */}
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.82)",
                    fontFamily: "'Tabular', 'SF Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.02em",
                    ml: 0.5,
                  }}
                >
                  {formatTime(currentTime)}
                  <Box component="span" sx={{ opacity: 0.45, mx: 0.4 }}>/</Box>
                  {formatTime(duration)}
                </Typography>
              </Stack>

              {/* Fullscreen */}
              <IconButton
                onClick={handleToggleFullscreen}
                size="small"
                sx={{ color: "#fff", p: 0.6 }}
              >
                {fullscreen
                  ? <FullscreenExitIcon sx={{ fontSize: 18 }} />
                  : <FullscreenIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Stack>
          </Box>
        </Fade>
      )}
    </Box>
  );
}