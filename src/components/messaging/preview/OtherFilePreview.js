import { Box, IconButton, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";

export default function OtherFilePreview({ file, onRemove, isViewOnce = false }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const fileName = file.name || file.file?.name || "Unknown file";
  const ext = fileName.split(".").pop()?.toUpperCase() ?? "FILE";
  const sizeKb = file.size ? `${(file.size / 1024).toFixed(0)} KB` : null;

  return (
    <Box
      sx={{
        position: "relative",
        flexShrink: 0,
        width: 120,
        height: 80,
        borderRadius: 2,
        bgcolor: isDark ? alpha("#fff", 0.06) : "#f0f2f5",
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.25,
        p: 1,
        overflow: "hidden",
      }}
    >
      <DescriptionIcon sx={{ fontSize: 26, color: "primary.main", opacity: 0.8 }} />

      <Typography
        noWrap
        sx={{
          fontSize: "0.65rem",
          fontWeight: 600,
          color: "text.primary",
          maxWidth: "100%",
          textAlign: "center",
        }}
      >
        {fileName}
      </Typography>

      {sizeKb && (
        <Typography sx={{ fontSize: "0.6rem", color: "text.disabled" }}>
          {sizeKb}
        </Typography>
      )}

      {/* Extension badge */}
      <Box
        sx={{
          position: "absolute",
          bottom: 4,
          left: 4,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: "primary.main",
          fontSize: "0.55rem",
          fontWeight: 800,
          px: 0.6,
          py: 0.15,
          borderRadius: 0.75,
          letterSpacing: "0.06em",
        }}
      >
        {ext}
      </Box>

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
            bgcolor: alpha(theme.palette.action.hover, 0.8),
            color: "error.main",
            "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
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
            right: 4,
            bgcolor: "error.main",
            color: "#fff",
            fontSize: "0.6rem",
            fontWeight: 800,
            px: 0.7,
            py: 0.2,
            borderRadius: 1,
          }}
        >
          1×
        </Box>
      )}
    </Box>
  );
}
