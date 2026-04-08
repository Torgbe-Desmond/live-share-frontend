import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  ListItem,
  Paper,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MessageReplyPreview from "./preview/MessageReplyPreview";
import MessageText from "./message/MessageText";
import ReplyMenu from "./action/ReplyMenu";
import MessageMediaList from "./media/MessageMediaList";
import MediaPreview from "./preview/MediaPreview";

const MessageBubble = forwardRef(
  ({ msg, senderId, onReply, onMediaViewed, onClickReply, roomName }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isDark = theme.palette.mode === "dark";
    const isOwn = msg.senderId === senderId;

    const msgRef = useRef(msg);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => { msgRef.current = msg; }, [msg]);

    const formattedTime = useMemo(() => {
      const d = new Date(msg.createdAt);
      return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
    }, [msg.createdAt]);

    const hasMedia = msg?.media && typeof msg.media === "object" && msg.media.video;

    // Bubble colors
    const ownBg = theme.palette.primary.main;
    const otherBg = isDark ? alpha("#fff", 0.06) : "#f0f2f5";
    const ownBorder = "none";
    const otherBorder = `1px solid ${alpha(theme.palette.divider, 0.5)}`;

    return (
      <ListItem
        ref={ref}
        disablePadding
        sx={{
          px: isMobile ? 1 : 1.5,
          py: 0.35,
          mt: isMobile ? 2.5 : 5.5,
          justifyContent: isOwn ? "flex-end" : "flex-start",
        }}
        onClick={() => isMobile && setIsActive((p) => !p)}
      >
        {hasMedia ? (
          <MediaPreview media={msg.media} />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: isOwn ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: 1,
              maxWidth: isMobile ? "88%" : "70%",
            }}
          >
            {/* Avatar */}
            <Avatar
              src={`https://robohash.org/${msg.username}?set=set4`}
              sx={{
                width: 30,
                height: 30,
                mb: 2.5,
                flexShrink: 0,
                border: `2px solid ${theme.palette.background.default}`,
                opacity: isOwn ? 0 : 1, // hide own avatar but keep spacing
                pointerEvents: "none",
              }}
            />

            {/* Bubble + meta */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start", gap: 0.3 }}>
              {/* Sender name (others only) */}
              {!isOwn && msg.username && (
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "text.disabled",
                    px: 1,
                    letterSpacing: "0.02em",
                  }}
                >
                  {msg.username}
                </Typography>
              )}

              {/* Bubble */}
              <Box sx={{ position: "relative" }}>
                <Paper
                  elevation={0}
                  sx={{
                    px: 1.5,
                    pt: 1,
                    pb: 0.75,
                    borderRadius: "18px",
                    borderBottomRightRadius: isOwn ? 4 : 18,
                    borderBottomLeftRadius: isOwn ? 18 : 4,
                    bgcolor: isOwn ? ownBg : otherBg,
                    color: isOwn ? "#fff" : "text.primary",
                    border: isOwn ? ownBorder : otherBorder,
                    boxShadow: isDark
                      ? "none"
                      : `0 1px 2px ${alpha("#000", 0.06)}`,
                    "&:active": { transform: "scale(0.99)" },
                    transition: "transform 0.1s ease",
                  }}
                >
                  <MessageReplyPreview
                    msg={msg}
                    isOwn={isOwn}
                    onClickReply={onClickReply}
                  />
                  <MessageMediaList files={msg.files} isOwn={isOwn} />
                  {msg.content !== "" && (
                    <MessageText content={msg.content} isOwn={isOwn} />
                  )}
                </Paper>

                {/* Action buttons — shown on hover (desktop) or tap (mobile) */}
                {(isActive || !isMobile) && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "calc(100% + 2px)",
                      [isOwn ? "right" : "right"]: 0,
                      zIndex: 10,
                    }}
                  >
                    <ReplyMenu
                      msg={msg}
                      senderId={senderId}
                      onReply={onReply}
                      roomName={roomName}
                      msgRef={msgRef}
                    />
                  </Box>
                )}
              </Box>

              {/* Timestamp */}
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  color: "text.disabled",
                  px: 0.75,
                  letterSpacing: "0.01em",
                }}
              >
                {formattedTime}
              </Typography>
            </Box>
          </Box>
        )}
      </ListItem>
    );
  }
);

export default MessageBubble;
