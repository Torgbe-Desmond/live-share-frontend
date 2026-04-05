import { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Slider,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Static waveform bars — decorative
function StaticWave({ isOwn, progress = 0 }) {
  const bars = [3, 6, 10, 8, 14, 10, 6, 12, 8, 5, 10, 14, 9, 6, 11, 8, 4, 9, 13, 7];
  const filledCount = Math.floor(progress * bars.length);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "2px", height: 20, flex: 1 }}>
      {bars.map((h, i) => (
        <Box
          key={i}
          sx={{
            width: 3,
            height: h,
            borderRadius: 1,
            flexShrink: 0,
            bgcolor: i < filledCount
              ? isOwn ? "rgba(255,255,255,0.9)" : "primary.main"
              : isOwn ? "rgba(255,255,255,0.3)" : alpha("#000", 0.15),
            transition: "background-color 0.1s",
          }}
        />
      ))}
    </Box>
  );
}

export default function AudioMessage({ file, isOwn }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState("");

  // Resolve src — local blob or remote URL
  useEffect(() => {
    if (file?.local && file?.file instanceof Blob) {
      const url = URL.createObjectURL(file.file);
      setSrc(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSrc(file?.path || file?.url || "");
    }
  }, [file]);

  // Wire up audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => { setDuration(audio.duration); setLoading(false); };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => { setPlaying(false); setCurrentTime(0); };
    const onError = () => setLoading(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setPlaying((p) => !p);
  };

  const handleSlider = (_, value) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.875,
        borderRadius: "14px",
        minWidth: 220,
        maxWidth: 300,
        bgcolor: isOwn
          ? alpha("#000", 0.15)
          : isDark
            ? alpha("#fff", 0.06)
            : alpha("#000", 0.04),
        border: `1px solid ${isOwn ? "rgba(255,255,255,0.1)" : alpha(theme.palette.divider, 0.4)}`,
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play / Pause button */}
      <IconButton
        size="small"
        onClick={togglePlay}
        disabled={loading}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: "50%",
          bgcolor: isOwn ? "rgba(255,255,255,0.2)" : alpha(theme.palette.primary.main, 0.1),
          color: isOwn ? "#fff" : "primary.main",
          "&:hover": {
            bgcolor: isOwn ? "rgba(255,255,255,0.3)" : alpha(theme.palette.primary.main, 0.18),
          },
        }}
      >
        {file.local && !file.isSuccess ? (
          <CircularProgress size={14} sx={{ color: "inherit" }} />
        ) : playing ? (
          <PauseIcon sx={{ fontSize: 17 }} />
        ) : (
          <PlayArrowIcon sx={{ fontSize: 17 }} />
        )}
      </IconButton>

      {/* Waveform + scrubber */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.25, minWidth: 0 }}>
        <StaticWave isOwn={isOwn} progress={progress} />
        <Slider
          size="small"
          min={0}
          max={duration || 1}
          step={0.01}
          value={currentTime}
          onChange={handleSlider}
          sx={{
            p: 0,
            height: 2,
            color: isOwn ? "rgba(255,255,255,0.7)" : "primary.main",
            "& .MuiSlider-thumb": {
              width: 8,
              height: 8,
              opacity: playing ? 1 : 0,
              transition: "opacity 0.2s",
              "&:hover": { opacity: 1 },
            },
            "& .MuiSlider-rail": {
              opacity: 0.3,
            },
          }}
        />
      </Box>

      {/* Time */}
      <Typography
        sx={{
          fontSize: "0.68rem",
          fontWeight: 600,
          color: isOwn ? "rgba(255,255,255,0.6)" : "text.disabled",
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
          minWidth: 28,
          textAlign: "right",
        }}
      >
        {playing ? formatTime(currentTime) : formatTime(duration)}
      </Typography>
    </Box>
  );
}
