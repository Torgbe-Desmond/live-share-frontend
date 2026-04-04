import { Typography } from "@mui/material";
import CodeDetector from "../../CodeDetector";

const URL_REGEX = /https?:\/\/[^\s]+/g;

function renderTextWithLinks(text, isOwn, key) {
  const parts = [];
  let lastIdx = 0;
  const urlRe = new RegExp(URL_REGEX.source, "g");
  let match;

  while ((match = urlRe.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(<span key={`t-${lastIdx}`}>{text.slice(lastIdx, match.index)}</span>);
    }
    parts.push(
      <a
        key={`u-${match.index}`}
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: isOwn ? "rgba(255,255,255,0.85)" : "#2563eb",
          textDecoration: "underline",
          textDecorationColor: isOwn ? "rgba(255,255,255,0.4)" : "rgba(37,99,235,0.4)",
          wordBreak: "break-all",
        }}
      >
        {match[0]}
      </a>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    parts.push(<span key={`t-${lastIdx}`}>{text.slice(lastIdx)}</span>);
  }

  return (
    <Typography
      key={key}
      component="span"
      sx={{
        display: "block",
        fontSize: "0.88rem",
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      {parts}
    </Typography>
  );
}

export default function MessageText({ content, isOwn = false }) {
  if (!content) return null;

  // Split on blank lines so multi-paragraph messages are
  // detected independently — a code block won't "contaminate"
  // surrounding plain text and vice versa
  const paragraphs = content.split(/\n{2,}/);

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <CodeDetector
          key={i}
          text={paragraph}
          isOwn={isOwn}
          fallback={renderTextWithLinks(paragraph, isOwn, i)}
        />
      ))}
    </>
  );
}