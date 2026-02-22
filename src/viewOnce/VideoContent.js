import {
  Box,
  CircularProgress,
  IconButton,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { alpha, useTheme } from "@mui/material/styles";
import VideoFooter from "./VideoFooter";
import { useRef } from "react";
import VideoHeader from "./VideoHeader";

export default function VideoContent({
  videoRef,
  url,
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
  showControls = true,
}) {
  const containerRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement)
      containerRef.current.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
    onToggleFullscreen(); // update parent state
  };

  const onClose = ()=>{
    
  }

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: isMobile ? "100%" : 500,
        height: fullscreen ? "100vh" : "auto",
        bgcolor: "black",
        // borderRadius: 2,
        overflow: "hidden",
        mx: "auto",
      }}
    >
      <VideoHeader title="My Video" onClose={onClose} />

      <video
        ref={videoRef}
        src={url}
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
          objectFit: fullscreen ? "cover" : "fill",
        }}
      />

      {(isLoading || isBuffering) && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha("#000", 0.5),
            zIndex: 10,
          }}
        >
          <CircularProgress color="primary" size={fullscreen ? 60 : 48} />
        </Box>
      )}

      {showControls && !isPlaying && !isLoading && !isBuffering && (
        <Box
          onClick={onPlayPause}
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha("#000", 0.3),
            cursor: "pointer",
            zIndex: 5,
            "&:hover": { bgcolor: alpha("#000", 0.45) },
            transition: "background 0.3s",
          }}
        >
          <PlayArrowIcon
            sx={{ fontSize: fullscreen ? 120 : 80, color: "white" }}
          />
        </Box>
      )}

      {showControls && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
            opacity: 0,
            transition: "opacity 0.4s",
            "&:hover": { opacity: 1 },
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={onPlayPause}
            size="small"
            sx={{ color: "white", p: 0.5 }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>

          <IconButton
            onClick={onToggleMute}
            size="small"
            sx={{ color: "white", p: 0.5 }}
          >
            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>

          <Box sx={{ flex: 1, mx: 1 }}>
            <Slider
              size="small"
              value={currentTime}
              min={0}
              max={duration || 1}
              step={0.1}
              onChange={(_, value) => onSeek(value)}
              sx={{
                color: "white",
                height: 4,
                "& .MuiSlider-thumb": {
                  width: 14,
                  height: 14,
                  transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0 0 0 8px rgba(255,255,255,0.16)",
                  },
                },
                "& .MuiSlider-rail": { opacity: 0.38 },
              }}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                color: "white",
                fontSize: "0.75rem",
                mt: 0.5,
                opacity: 0.85,
              }}
            >
              <Typography variant="caption">
                {formatTime(currentTime)}
              </Typography>
              <Typography variant="caption">{formatTime(duration)}</Typography>
            </Stack>
          </Box>

          <IconButton
            onClick={handleToggleFullscreen}
            size="small"
            sx={{ color: "white", p: 0.5 }}
          >
            {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Stack>
      )}

      <VideoFooter
        toggleMute={onToggleMute}
        isMuted={isMuted}
        isVideoBuffering={isBuffering}
        currentTime={currentTime}
        videoRef={videoRef}
        duration={duration}
        isVideoPlaying={isPlaying}
        onSeek={onSeek}
        onVideoPress={onPlayPause}
      />
    </Box>
  );
}
