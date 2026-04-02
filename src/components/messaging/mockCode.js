import { Box } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export function detectCodeLanguage(code) {
  if (!code || typeof code !== "string" || code.trim() === "") return "unknown";

  const text = code.toLowerCase();
  const trimmed = code.trim();
  const lines = code.split("\n");

  const score = { javascript: 0, jsx: 0, typescript: 0, tsx: 0, python: 0, csharp: 0 };

  if (/def\s+[a-z_][a-z0-9_]*\s*\(/.test(text)) score.python += 30;
  if (/\busing\s+[A-Za-z.]+\s*;/i.test(text)) score.csharp += 28;
  if (/import\s+.*\s+from\s+['"]/.test(text) || /require\(['"]/.test(text)) score.javascript += 22;
  if (/\b(public|private|protected|internal)\s+(class|interface|record|enum|struct)\b/i.test(text)) score.csharp += 24;

  const hasJsxLikeTag = /<\s*[A-Z][A-Za-z0-9_]*[\s/>]/.test(code);
  const hasClassName = /className\s*=/.test(code);
  if (hasJsxLikeTag) { score.jsx += 22; score.tsx += 18; }
  if (hasClassName) { score.jsx += 16; score.tsx += 12; }

  const reactHooks = ["usestate", "useeffect", "usememo", "usecallback", "usereducer", "usecontext"];
  if (reactHooks.some((h) => text.includes(h))) { score.jsx += 18; score.javascript += 10; }

  if (/\binterface\s+[A-Z]/.test(text) || /:\s*(string|number|boolean|any|void)\b/.test(text)) {
    score.typescript += 20; score.tsx += 16;
  }

  if (/\bprint\s*\(/.test(text)) score.python += 12;
  if (/\bConsole\.(Write|WriteLine)\(/.test(text)) score.csharp += 14;
  if (/\bconst\s+[a-zA-Z_]\w*\s*=/.test(text)) score.javascript += 10;
  if (/export\s+(default|const|function|type|interface)/.test(text)) score.javascript += 11;
  if (/=>/.test(text)) score.javascript += 9;

  const semicolonCount = (code.match(/;/g) || []).length;
  if (semicolonCount > 6 && lines.length > 4) { score.javascript += 7; score.csharp += 9; }

  const maxScore = Math.max(...Object.values(score));
  if (maxScore < 10) return trimmed.length > 20 ? "text" : "unknown";

  const preference = ["jsx", "tsx", "javascript", "typescript", "python", "csharp"];
  for (const lang of preference) {
    if (score[lang] >= maxScore - 4) return lang;
  }
  return "text";
}

/** Proper React component — renders a syntax-highlighted code block. */
export default function MockCode({ code }) {
  const detected = detectCodeLanguage(code);
  const isCode = detected !== "text" && detected !== "unknown";

  if (!isCode) return null;

  const prismLang = { jsx: "jsx", tsx: "tsx", javascript: "javascript", typescript: "typescript", python: "python", csharp: "csharp" }[detected] || "plaintext";

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
      <SyntaxHighlighter
        language={prismLang}
        style={coy}
        showLineNumbers={code.split("\n").length > 2}
        wrapLongLines={false}
        customStyle={{ margin: "0.8em 0", borderRadius: 8, fontSize: "0.85rem", minWidth: "max-content" }}
      >
        {String(code).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </Box>
  );
}
