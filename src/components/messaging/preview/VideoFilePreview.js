import { Box, IconButton, Tooltip, alpha } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function VideoFilePreview({ file, onRemove, isViewOnce = false }) {
  const src = file.file instanceof File
    ? URL.createObjectURL(file.file)
    : file.path;

  return (
    <Box
      sx={{
        position: "relative",
        flexShrink: 0,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: `0 2px 8px ${alpha("#000", 0.15)}`,
      }}
    >
      <Box
        component="video"
        src={src}
        controls
        muted
        sx={{
          width: 130,
          height: 80,
          objectFit: "cover",
          display: "block",
          bgcolor: "#000",
        }}
      />

      {/* Remove button */}
      <Tooltip title="Remove">
        <IconButton
          size="small"
          onClick={() => onRemove?.(file)}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            p: 0.3,
            bgcolor: "rgba(0,0,0,0.55)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 13 }} />
        </IconButton>
      </Tooltip>

      {isViewOnce && (
        <Box
          sx={{
            position: "absolute",
            bottom: 4,
            left: 4,
            bgcolor: "error.main",
            color: "#fff",
            fontSize: "0.6rem",
            fontWeight: 800,
            px: 0.7,
            py: 0.2,
            borderRadius: 1,
            letterSpacing: "0.05em",
          }}
        >
          1×
        </Box>
      )}
    </Box>
  );
}
