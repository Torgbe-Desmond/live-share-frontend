import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const API_URL = ["http://localhost:8000/code-detect/predict", "https://models-0chn.onrender.com/predict"][1]


export default function CodeDetector({ text, isOwn = false, threshold = 0.75, fallback = null }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!text?.trim()) return;

        let cancelled = false;
        const detect = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text, threshold }),
                });
                if (!res.ok) throw new Error(`API error: ${res.status}`);
                const data = await res.json();
                console.log("data", data)
                if (!cancelled) setResult(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        detect();
        return () => { cancelled = true; };
    }, [text, threshold]);

    // ── Loading ──
    if (loading) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5, opacity: 0.5 }}>
                <CircularProgress size={12} />
                <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>
                    Detecting...
                </Typography>
            </Box>
        );
    }

    // ── Error or API down — render fallback (has link detection) or plain box ──
    if (error || !result) {
        return fallback ?? <PlainBlock text={text} isOwn={isOwn} isDark={isDark} />;
    }

    // ── Not code — render fallback so links still work ──
    if (!result.is_code) {
        return fallback ?? <PlainBlock text={text} isOwn={isOwn} isDark={isDark} />;
    }

    // ── Detected as code ──
    const style = isDark || isOwn ? oneDark : coy;
    const language = result.language ?? "code";
    const showLineNumbers = text.split("\n").length > 2;

    return (
        <Box sx={{ width: "100%", borderRadius: "8px", overflow: "hidden", mt: 0.5 }}>
            {/* Language badge */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 1.5,
                    py: 0.4,
                    bgcolor: isDark || isOwn ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.07)",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: isOwn ? "rgba(255,255,255,0.5)" : "text.disabled",
                    }}
                >
                    {language}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "0.65rem",
                        color: isOwn ? "rgba(255,255,255,0.35)" : "text.disabled",
                    }}
                >
                    {Math.round(result.confidence * 100)}% confidence
                </Typography>
            </Box>

            <SyntaxHighlighter
                language={language}
                style={style}
                showLineNumbers={showLineNumbers}
                wrapLongLines={false}
                customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: "0.82rem",
                    // background: isOwn ? "rgba(0,0,0,0.25)" : undefined,
                }}
            >
                {String(text).replace(/\n$/, "")}
            </SyntaxHighlighter>
        </Box>
    );
}

// ── Plain preformatted fallback ───────────────────────────────────────────────
function PlainBlock({ text, isOwn, isDark }) {
    return (
        <Box
            component="pre"
            sx={{
                mt: 0.5,
                mb: 0.25,
                px: 1.5,
                py: 1,
                borderRadius: "8px",
                bgcolor: isDark || isOwn ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.05)",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: "0.82rem",
                lineHeight: 1.6,
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: isOwn ? "rgba(255,255,255,0.9)" : "text.primary",
                m: 0,
            }}
        >
            {text}
        </Box>
    );
}