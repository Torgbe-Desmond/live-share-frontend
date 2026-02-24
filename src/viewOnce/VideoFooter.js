import {
  Box,
  IconButton,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { alpha } from "@mui/material/styles";

export default function VideoFooter({
  toggleMute,
  isMuted,
  isVideoBuffering,
  currentTime,
  videoRef,
  duration,
  isVideoPlaying,
  onSeek,
  onVideoPress,
}) {
  // Format time as mm:ss
  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // const progress = useMemo(
  //   () => (duration > 0 ? (currentTime / duration) * 100 : 0),
  //   [currentTime, duration]
  // );

//   .footer-wrapper {
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     display: flex;
//     width: 100%;
//     justify-content: center;
//     align-items: center;
//     z-index: 10;
//     text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
//     background: rgba(0, 0, 0, 0.3);
// }


  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent:"center",
        gap: 1.5,
        bgcolor: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
        // opacity: 0,
        // transition: "opacity 0.4s",
        // "&:hover, &:focus-within": { opacity: 1 },
        zIndex: 15,
        width:"100%"

      }}
      className="footer-vvv"
    >
      {/* Play/Pause */}
      <IconButton
        onClick={onVideoPress}
        size="small"
        disabled={isVideoBuffering}
        sx={{ color: "white", p: 0.5 }}
      >
        {isVideoPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      {/* Mute/Unmute */}
      <IconButton
        onClick={toggleMute}
        size="small"
        sx={{ color: "white", p: 0.5 }}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>

      {/* Progress + Time */}
      <Box sx={{ flex: 1, mx: 1 }}>
        <Slider
          size="small"
          value={currentTime}
          min={0}
          max={duration || 1}
          step={0.1}
          onChange={(_, value) => onSeek(value)}
          disabled={isVideoBuffering}
          sx={{
            color: "white",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 14,
              height: 14,
              transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0 0 0 8px ${alpha("#fff", 0.16)}`,
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
            opacity: 0.9,
          }}
        >
          <Typography variant="caption">{formatTime(currentTime)}</Typography>
          <Typography variant="caption">{formatTime(duration)}</Typography>
        </Stack>
      </Box>
    </Box>
  );
}