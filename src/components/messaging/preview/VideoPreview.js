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
import VideoContent from "../../../viewOnce/VideoContent";

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

  // ── Rich player state ─────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // ── Resolve video src ─────────────────────────────────────────────────────
  useEffect(() => {
    let objectUrl;
    if (file.local && file.file instanceof File) {
      objectUrl = URL.createObjectURL(file.file);
      setVideoSrc(objectUrl);
    } else {
      setVideoSrc(file.path || "");
    }
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [file]);

  // ── Wire up video events ──────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    // isPlaying is driven ONLY by these events — never set optimistically
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => { setIsLoading(false); setIsBuffering(false); };
    const onLoadStart = () => setIsLoading(true);
    const onLoadedMeta = () => { setIsLoading(false); setDuration(video.duration || 0); };
    const onTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadstart", onLoadStart);
    video.addEventListener("loadedmetadata", onLoadedMeta);
    video.addEventListener("timeupdate", onTimeUpdate);

    // Autoplay on scroll into view — uploaded files only
    let observer;
    if (!file.local) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) video.play().catch(() => { });
          else video.pause();
        },
        { threshold: 0.6 },
      );
      observer.observe(video);
    }

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadstart", onLoadStart);
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      video.removeEventListener("timeupdate", onTimeUpdate);
      observer?.disconnect();
      video.pause();
    };
  }, [videoSrc, file.local]);

  // ── View-once: mark viewed on first play ──────────────────────────────────
  useEffect(() => {
    if (!restrictedViewOnce || hasTriggeredView.current) return;
    const video = videoRef.current;
    if (!video) return;

    const handleFirstPlay = () => {
      if (!hasTriggeredView.current) {
        hasTriggeredView.current = true;
        onViewed?.();
      }
    };
    video.addEventListener("play", handleFirstPlay, { once: true });
    return () => video.removeEventListener("play", handleFirstPlay);
  }, [restrictedViewOnce, onViewed]);

  // ── Fullscreen sync ───────────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ── Handlers: command the element, let events update state ───────────────
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => { });
    else video.pause();
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleToggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) video.requestFullscreen().catch(() => { });
    else document.exitFullscreen().catch(() => { });
  };

  const handleSeek = (time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Array.isArray(time) ? time[0] : time;
    setCurrentTime(video.currentTime);
  };

  const isViewOnce = !!file?.viewOnce;
  const useRichPlayer = !file.local && !!file.path;

  return (
    <Box
      p={0}
      borderRadius={2}
      overflow="hidden"
      position="relative"
      sx={{
        transition: "border 0.3s",
        // Target the stable MUI class name, not the hash
        "& .css-qey3gt-MuiPaper-root": {
          padding: 0,
          bgcolor: "red"
        }
      }}
    >
      {useRichPlayer ? (
        <VideoContent
          videoRef={videoRef}
          url={videoSrc}
          file={file}
          isPlaying={isPlaying}
          isMuted={isMuted}
          isLoading={isLoading}
          isBuffering={isBuffering}
          currentTime={currentTime}
          duration={duration}
          fullscreen={fullscreen}
          onPlayPause={handlePlayPause}
          onToggleMute={handleToggleMute}
          onToggleFullscreen={handleToggleFullscreen}
          onSeek={handleSeek}
          showControls={!restrictedViewOnce}
        />
      ) : (
        <Box sx={{
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
        }}>
          <video
            ref={videoRef}
            src={videoSrc || null}
            muted={restrictedViewOnce}
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
        </Box>
      )}

      {/* View-once toggle (sender only) */}
      {showViewOnceToggle && (
        <Tooltip title={isViewOnce ? "View once – recipient sees once" : "Normal – replay allowed"}>
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
              zIndex: 20,
              "&:hover": { bgcolor: isViewOnce ? "primary.dark" : "#fff" },
            }}
          >
            <VisibilityOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* View-once badge */}
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
            color: "#fff",
            borderRadius: 10,
            px: 1,
            py: 0.4,
            fontSize: "0.75rem",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <VisibilityOffIcon sx={{ fontSize: "0.85rem" }} />
          <Typography variant="inherit">1×</Typography>
        </Box>
      )}

      {/* Upload overlay */}
      {file.local && !file.isSuccess && (
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
              sx={{ color: "#fff", bgcolor: "rgba(0,0,0,0.4)" }}
            >
              <ReplayIcon />
            </IconButton>
          ) : (
            <CircularProgress size={36} sx={{ color: "#fff" }} />
          )}
        </Box>
      )}


    </Box>
  );
}