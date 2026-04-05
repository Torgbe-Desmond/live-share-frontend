import { Box, alpha, useTheme } from "@mui/material";
import { useState } from "react";
import ImageFilePreview from "./ImageFilePreview";
import VideoFilePreview from "./VideoFilePreview";
import OtherFilePreview from "./OtherFilePreview";

export default function UploadedFilesPreview({ selectedFiles, setSelectedFiles }) {
  const theme = useTheme();
  const [viewOnceMap, setViewOnceMap] = useState({});

  const handleRemove = (file) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      [...next].forEach((f) => {
        if (f.publicId === file.publicId) next.delete(f);
      });
      return next;
    });
    setViewOnceMap((prev) => {
      const next = { ...prev };
      delete next[file.publicId];
      return next;
    });
  };

  const toggleViewOnce = (file) => {
    setViewOnceMap((prev) => ({
      ...prev,
      [file.publicId]: !prev[file.publicId],
    }));
  };

  if (!selectedFiles || selectedFiles.size === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        p: 1.5,
        overflowX: "auto",
        borderRadius: "12px 12px 0 0",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        borderLeftWidth: 3,
        borderLeftColor: "primary.main",
        bgcolor: alpha(theme.palette.primary.main, 0.03),
        mb: "-5px",
        mr:2,
        ml:2,
        // Slim scrollbar
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: 4,
          bgcolor: alpha(theme.palette.divider, 0.5),
        },
      }}
    >
      {[...selectedFiles].map((file) =>
        file.type?.startsWith("video/") ? (
          <VideoFilePreview
            key={file.publicId}
            file={file}
            onRemove={handleRemove}
            isViewOnce={!!viewOnceMap[file.publicId]}
            onToggleViewOnce={toggleViewOnce}
          />
        ) : file.type?.startsWith("image/") ? (
          <ImageFilePreview
            key={file.publicId}
            file={file}
            onRemove={handleRemove}
            isViewOnce={!!viewOnceMap[file.publicId]}
            onToggleViewOnce={toggleViewOnce}
          />
        ) : (
          <OtherFilePreview
            key={file.publicId}
            file={file}
            onRemove={handleRemove}
            isViewOnce={!!viewOnceMap[file.publicId]}
          />
        )
      )}
    </Box>
  );
}
