import {
  Box,
  Paper,
  ListItem,
  Typography,
  Avatar,
  alpha,
  useTheme,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { forwardRef, useEffect, useRef, useState } from "react";

import FilePreview from "./FilePreview";
import VideoPreview from "./VideoPreview";
import Video from "../../viewOnce/Video";
import GenericFilePreview from "./GenericFilePreview";
import ReplyMenu from "./ReplyMenu";

const MessageBubble = forwardRef(
  ({ msg, senderId, onReply, onMediaViewed, onClicReply }, ref) => {
    const theme = useTheme();
    const isOwn = msg.senderId === senderId;

    const [duration, setDuration] = useState(0);
    const msgRef = useRef(msg);

    // Hover state for showing reply button
    const [showReplyBtn, setShowReplyBtn] = useState(false);

    useEffect(() => {
      msgRef.current = msg;
    }, [msg]);

    const [revealedFiles, setRevealedFiles] = useState({});
    const [viewedFiles, setViewedFiles] = useState({});

    const handleReveal = (file) => {
      const publicId = file.publicId;

      if (revealedFiles[publicId] || viewedFiles[publicId]) return;

      setRevealedFiles((prev) => ({ ...prev, [publicId]: true }));

      const timer = setTimeout(() => {
        setViewedFiles((prev) => ({ ...prev, [publicId]: true }));
        onMediaViewed?.(publicId);
      }, 30000); // Note: you had 120000 earlier – now 30s as in last version

      return () => clearTimeout(timer);
    };

    return (
      <ListItem
        ref={ref}
        sx={{
          px: 0,
          py: 0.5,
          justifyContent: isOwn ? "flex-end" : "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isOwn ? "row-reverse" : "row",
            alignItems: "flex-start", // changed to flex-start for better alignment
            gap: 1.2,
            maxWidth: "80%",
            position: "relative", // for absolute positioning of reply button
          }}
          onMouseEnter={() => setShowReplyBtn(true)}
          onMouseLeave={() => setShowReplyBtn(false)}
          // For mobile: could add onTouchStart / onContextMenu if needed
        >
          <Avatar
            src={`https://robohash.org/${msg.username}?set=set4`}
            sx={{
              width: 36,
              height: 36,
              mt: 0.5, // slight top margin alignment
              bgcolor: isOwn
                ? theme.palette.primary.dark
                : theme.palette.grey[400],
            }}
          />

          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 3,
              borderTopRightRadius: isOwn ? 0 : 12,
              borderTopLeftRadius: isOwn ? 12 : 0,
              bgcolor: isOwn ? theme.palette.primary.main : "#fff",
              color: isOwn
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              boxShadow: isOwn
                ? "0 4px 12px rgba(25,118,210,0.28)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              position: "relative",
              maxWidth: "100%",
              transition: "all 0.18s ease",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                opacity: 0.85,
                mb: 0.5,
                display: "block",
              }}
            >
              {msg.username}
            </Typography>

            {msg?.replyTo && (
              <Box
                sx={{
                  borderLeft: isOwn
                    ? "3px solid rgba(255,255,255,0.4)"
                    : `3px solid ${theme.palette.primary.main}`,
                  pl: 1.5,
                  py: 0.5,
                  mb: 1,
                  opacity: 0.9,
                  bgcolor: isOwn
                    ? alpha("#000", 0.15)
                    : alpha(theme.palette.grey[200], 0.6),
                  borderRadius: 1.5,
                }}
                onClick={() => onClicReply(msg)}
              >
                {msg?.replyTo?.files?.length > 0 &&
                  msg.replyTo.files.map((file, i) =>
                    !file.local ? (
                      <Box
                        key={i}
                        component="img"
                        src={file.path}
                        controls
                        muted
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          display: "block",
                          bgcolor: "black",
                          mr: 1,
                          mb: 0.5,
                        }}
                      />
                    ) : null,
                  )}

                <Typography variant="caption" fontWeight={600}>
                  {msg.replyTo.username}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {msg.replyTo.content}
                </Typography>
              </Box>
            )}

            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {msg.content}
            </Typography>

            {/* Media rendering */}
            {msg?.files?.map((file, index) => {
              const isViewOnce = !!file.viewOnce;
              const isVideo = file.type?.startsWith("video/");
              const publicId = file.publicId;
              const isRevealed = revealedFiles[publicId];
              const isViewed = viewedFiles[publicId] || !!file.viewed;
              const isImage = file.type?.startsWith("image/");

              if (!isOwn && isViewOnce) {
                if (isViewed) {
                  return (
                    <Box
                      key={publicId || index}
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
                  return (
                    <Box
                      key={publicId || index}
                      onClick={() => handleReveal(file)}
                      sx={{
                        mt: 1.5,
                        p: 2.5,
                        bgcolor: alpha(theme.palette.grey[500], 0.12),
                        borderRadius: 2.5,
                        textAlign: "center",
                        cursor: "pointer",
                        maxWidth: 420,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.grey[500], 0.2),
                        },
                      }}
                    >
                      <LockIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Tap to view once
                      </Typography>
                    </Box>
                  );
                }

                if (isVideo) {
                  return (
                    <Box
                      key={publicId || index}
                      sx={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1300,
                        bgcolor: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Video
                        url={file.path}
                        fullscreen={true}
                        setDuration={setDuration}
                        duration={duration}
                      />
                    </Box>
                  );
                }

                return (
                  <FilePreview
                    key={publicId || index}
                    file={file}
                    restrictedViewOnce={false}
                  />
                );
              }

              if (isVideo) {
                return (
                  <VideoPreview
                    key={publicId || index}
                    file={file}
                    restrictedViewOnce={false}
                    onViewed={() => isViewOnce && onMediaViewed?.(publicId)}
                  />
                );
              }

              if (isImage) {
                return (
                  <FilePreview
                    key={publicId || index}
                    file={file}
                    restrictedViewOnce={false}
                    onViewed={() => isViewOnce && onMediaViewed?.(publicId)}
                  />
                );
              }

              return (
                <GenericFilePreview
                  key={publicId || index}
                  file={file}
                  restrictedViewOnce={isViewOnce}
                  onViewed={() => isViewOnce && onMediaViewed?.(publicId)}
                />
              );
            })}

            <ReplyMenu
              msg={msg}
              senderId={senderId}
              onReply={onReply}
              msgRef={msgRef}
              showReplyBtn={showReplyBtn}
            />
          </Paper>
        </Box>
      </ListItem>
    );
  },
);

export default MessageBubble;
