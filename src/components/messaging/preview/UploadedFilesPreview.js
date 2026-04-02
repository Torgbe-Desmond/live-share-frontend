import { Box, useTheme } from "@mui/material";
import { useState } from "react";
import ImageFilePreview from "./ImageFilePreview";
import VideoFilePreview from "./VideoFilePreview";
import OtherFilePreview from "./OtherFilePreview";

export default function UploadedFilesPreview({
  selectedFiles,
  setSelectedFiles,
}) {
  // Track view-once status per file (using publicId or name as key)
  const [viewOnceMap, setViewOnceMap] = useState({});
  const theme = useTheme();

  const handleRemove = (file) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      // Remove the file from the set
      [...newSet].forEach((f) => {
        if (f.publicId === file.publicId) newSet.delete(f);
      });
      return newSet;
    });

    // Also clean up view-once state
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
        p: 2,
        overflowX: "auto",
        borderRadius: 2,
        border:"1px solid divider",
        mb:1,
        borderLeft: "4px solid #85c3f5",
        maxWidth: "100%",
        bgcolor: theme.palette.background.paper,
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
        ),
      )}
    </Box>
  );
}
