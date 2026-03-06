import ViewOnceLocked from "./ViewOnceLocked";
import ViewOnceImage from "./ViewOnceImage";
import ViewOnceVideo from "./ViewOnceVideo";
import { Box, Typography, alpha, useTheme } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ViewOnceMedia = ({
  file,
  isVideo,
  revealedFiles,
  viewedFiles,
  handleReveal,
  duration,
  setDuration,
}) => {
  const theme = useTheme();

  const publicId = file.publicId;
  const isRevealed = revealedFiles[publicId];
  const isViewed = viewedFiles[publicId] || !!file.viewed;

  if (isViewed) {
    return (
      <Box
        sx={{
          mt: 1.5,
          p: 3,
          bgcolor: alpha(theme.palette.grey[800], 0.15),
          borderRadius: 2.5,
          textAlign: "center",
          color: theme.palette.text.secondary,
          maxWidth: 420,
        }}
      >
        <VisibilityOffIcon fontSize="large" color="disabled" />
        <Typography variant="body1" fontWeight={500}>
          Viewed
        </Typography>
      </Box>
    );
  }

  if (!isRevealed) {
    return <ViewOnceLocked onClick={() => handleReveal(file)} />;
  }

  if (isVideo) {
    return (
      <ViewOnceVideo
        file={file}
        duration={duration}
        setDuration={setDuration}
      />
    );
  }

  return <ViewOnceImage file={file} />;
};

export default ViewOnceMedia;