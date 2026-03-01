import { Box } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Improved language detection for common code in chat/messages:
 *   - JavaScript / JSX / TS / TSX
 *   - Python
 *   - C#
 *   - fallback → "text" or "unknown"
 *
 * Returns: "javascript" | "jsx" | "typescript" | "tsx" | "python" | "csharp" | "text" | "unknown"
 */
export function detectCodeLanguage(code) {
  if (!code || typeof code !== "string" || code.trim() === "") {
    return "unknown";
  }

  const text = code.toLowerCase();
  const trimmed = code.trim();
  const lines = code.split("\n");
  const lineCount = lines.length;

  const score = {
    javascript: 0,
    jsx: 0,          // subset — will promote to jsx if strong signals
    typescript: 0,
    tsx: 0,
    python: 0,
    csharp: 0,
  };

  // ─── Very strong / structural signals ──────────────────────────────────────
  if (/def\s+[a-z_][a-z0-9_]*\s*\(/.test(text))              score.python += 30;
  if (/\busing\s+[A-Za-z.]+\s*;/i.test(text))                score.csharp += 28;
  if (/import\s+.*\s+from\s+['"]/.test(text) || /require\(['"]/.test(text))
                                                             score.javascript += 22;

  // Strong C# / .NET patterns
  if (/\b(public|private|protected|internal)\s+(class|interface|record|enum|struct)\b/i.test(text))
                                                             score.csharp += 24;

  // ─── JSX / React / TSX signals ─────────────────────────────────────────────
  const hasJsxLikeTag = /<\s*[A-Z][A-Za-z0-9_]*[\s/>]/.test(code); // Capital component
  const hasClassName   = /className\s*=/.test(code);
  const hasSxOrStyle   = /sx\s*=\s*{/.test(code) || /style\s*=\s*{/.test(code);

  if (hasJsxLikeTag) {
    score.jsx += 22;
    score.tsx += 18;
  }
  if (hasClassName || hasSxOrStyle) {
    score.jsx += 16;
    score.tsx += 12;
  }

  // React hooks (strong React indicator)
  const reactHooks = ["usestate", "useeffect", "usememo", "usecallback", "usereducer", "usecontext"];
  if (reactHooks.some(hook => text.includes(hook))) {
    score.jsx += 18;
    score.javascript += 10;
  }

  // ─── TypeScript / TSX specific ─────────────────────────────────────────────
  if (/\binterface\s+[A-Z]/.test(text) || /\btype\s+[A-Z]/.test(text) ||
      /:\s*(string|number|boolean|any|unknown|void)\b/.test(text) ||
      /\bas\s+const\b/.test(text)) {
    score.typescript += 20;
    score.tsx += 16;
  }

  // ─── Medium confidence signals ─────────────────────────────────────────────
  // Python
  if (/\bprint\s*\(/.test(text) || text.includes("if __name__ == '__main__':"))
                                                             score.python += 12;
  if (lines.some(l => l.trim().endsWith(":") && !l.includes("=") && !l.includes("->")))
                                                             score.python += 10;

  // C#
  if (/\bConsole\.(Write|WriteLine)\(/.test(text))           score.csharp += 14;
  if (/\bvar\s+[a-zA-Z_]\w*\s*=/.test(text))                 score.csharp += 11;

  // JS/TS common
  if (/\bconst\s+[a-zA-Z_]\w*\s*=/.test(text))               score.javascript += 10;
  if (/let\s+[a-zA-Z_]\w*\s*=/.test(text))                   score.javascript += 8;
  if (/export\s+(default|const|function|type|interface)/.test(text))
                                                             score.javascript += 11;
  if (/=>/.test(text))                                       score.javascript += 9;

  // ─── Style / syntax shape tie-breakers ─────────────────────────────────────
  const semicolonCount = (code.match(/;/g) || []).length;
  if (semicolonCount > 6 && lineCount > 4) {
    score.javascript += 7;
    score.csharp += 9;
    score.typescript += 6;
  }

  const braceCount = (code.match(/[{}]/g) || []).length;
  if (braceCount < 5 && lineCount > 7) {
    score.python += 10;
  }

  // Very short snippets
  const shortJsPattern = code.trim().length < 80 && /=>|\{\s*[a-z]+:/.test(code);
  if (shortJsPattern) {
    score.javascript += 14;
    score.jsx += 10;
  }

  // ─── Decide ────────────────────────────────────────────────────────────────
  const maxScore = Math.max(...Object.values(score));

  if (maxScore < 10) {
    return trimmed.length > 20 ? "text" : "unknown";
  }

  // Collect top candidates
  const candidates = [];
  if (score.jsx >= maxScore - 4)        candidates.push("jsx");
  else if (score.javascript >= maxScore - 4) candidates.push("javascript");

  if (score.tsx >= maxScore - 4)        candidates.push("tsx");
  else if (score.typescript >= maxScore - 4) candidates.push("typescript");

  if (score.python === maxScore)        candidates.push("python");
  if (score.csharp === maxScore)        candidates.push("csharp");

  // Preference order in ambiguous cases (most → least likely in chat context)
  const preference = ["jsx", "tsx", "javascript", "typescript", "python", "csharp"];

  for (const lang of preference) {
    if (candidates.includes(lang)) return lang;
  }

  return maxScore >= 14 ? "text" : "unknown";
}

// ──────────────────────────────────────────────────────────────────────────────
// Highlighter component (robust version)
// ──────────────────────────────────────────────────────────────────────────────
export default function MockCode({ code, className = "" }) {
  const detected = detectCodeLanguage(code);

  const isCode =
    detected !== "text" && detected !== "unknown";

  if (!isCode) {
    return {
      type: "text",
      content: String(code).replace(/\n$/, ""),
    };
  }

  const prismLang = {
    jsx: "jsx",
    tsx: "tsx",
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    csharp: "csharp",
  }[detected] || "plaintext";

  return {
    type: "code",
    content: (
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        <SyntaxHighlighter
          language={prismLang}
          style={coy}
          showLineNumbers={code.split("\n").length > 2}
          wrapLongLines={false}
          customStyle={{
            margin: "0.8em 0",
            borderRadius: 8,
            fontSize: "0.85rem",
            minWidth: "max-content",
          }}
          className={`code-block language-${detected} ${className}`}
        >
          {String(code).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </Box>
    ),
  };
}