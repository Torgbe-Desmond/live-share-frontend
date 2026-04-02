import React from "react";
import { Typography } from "@mui/material";
import MockCode from "../mockCode";

const URL_REGEX = /https?:\/\/[^\s]+/g;
const CODE_BLOCK_REGEX = /```([\s\S]*?)```/g;

export default function MessageText({ content }) {
  if (!content) return null;

  // Split content into segments: code blocks, plain text with URLs
  const segments = [];
  let lastIndex = 0;
  let match;

  // Reset regex state
  CODE_BLOCK_REGEX.lastIndex = 0;

  while ((match = CODE_BLOCK_REGEX.exec(content)) !== null) {
    // Text before this code block
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: "code", value: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last code block
  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  const renderTextWithLinks = (text, key) => {
    const parts = [];
    let lastIdx = 0;
    let urlMatch;
    const urlRe = new RegExp(URL_REGEX.source, "g");

    while ((urlMatch = urlRe.exec(text)) !== null) {
      if (urlMatch.index > lastIdx) {
        parts.push(<span key={`t-${lastIdx}`}>{text.slice(lastIdx, urlMatch.index)}</span>);
      }
      parts.push(
        <a
          key={`u-${urlMatch.index}`}
          href={urlMatch[0]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#d28519", textDecoration: "underline", cursor: "pointer" }}
        >
          {urlMatch[0]}
        </a>
      );
      lastIdx = urlMatch.index + urlMatch[0].length;
    }

    if (lastIdx < text.length) {
      parts.push(<span key={`t-${lastIdx}`}>{text.slice(lastIdx)}</span>);
    }

    return (
      <Typography
        key={key}
        variant="body1"
        component="span"
        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "anywhere", display: "block" }}
      >
        {parts}
      </Typography>
    );
  };

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "code" ? (
          <MockCode key={i} code={seg.value} />
        ) : (
          renderTextWithLinks(seg.value, i)
        )
      )}
    </>
  );
}
