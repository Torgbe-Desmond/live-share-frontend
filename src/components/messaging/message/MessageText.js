import { Typography } from "@mui/material";

const MessageText = ({ content }) => {
  if (!content) return null;

  return (
    <Typography
      variant="body1"
      sx={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      {content}
    </Typography>
  );
};

export default MessageText;