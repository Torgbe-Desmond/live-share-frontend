import React from "react";
import { Typography } from "@mui/material";

const MessageText = ({ content }) => {
  if (!content) return null;

  const urlRegex = /^https?:\/\/[^\s]+$/;
  
  // Split by spaces to handle tokens
  const tokens = content.split(" ");

  const renderContent = tokens.map((token, idx) => {
    // Check if the token is a URL
    if (urlRegex.test(token)) {
      return (
        <a
          key={idx}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#d28519", textDecoration: "underline", cursor: "pointer" }}
        >
          {token}
        </a>
      );
    }
    // Return the token as text with a trailing space
    return <span key={idx}>{token} </span>;
  });

  return (
    <Typography
      variant="body1"
      sx={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      {renderContent}
    </Typography>
  );
};

export default MessageText;