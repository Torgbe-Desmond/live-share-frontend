import { forwardRef, useEffect, useRef, useState, useMemo } from "react";
import {
  Box,
  Paper,
  ListItem,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MessageReplyPreview from "./preview/MessageReplyPreview";
import MessageText from "./message/MessageText";
import ReplyMenu from "./action/ReplyMenu";
import MessageMediaList from "./media/MessageMediaList";
import MediaPreview from "./preview/MediaPreview";

const MessageBubble = forwardRef(
  (
    {
      msg,
      senderId,
      onReply,
      onMediaViewed,
      onClicReply,
      handleCallMedia,
      roomName,
    },
    ref,
  ) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isOwn = msg.senderId === senderId;

    const msgRef = useRef(msg);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      msgRef.current = msg;
    }, [msg]);

    const formattedTime = useMemo(() => {
      const d = new Date(msg.createdAt);
      return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
    }, [msg.createdAt]);

    const hasMedia = msg?.media && typeof msg.media === 'object' && msg.media.video;

    return (
      <ListItem
        ref={ref}
        disablePadding
        sx={{
          px: isMobile ? 1 : 2,
          py: 0.5,
          justifyContent: isOwn ? "flex-end" : "flex-start",
          bgcolor: isActive ? "action.selected" : "transparent",
          transition: "background-color 0.2s ease",
        }}
        onClick={() => isMobile && setIsActive(!isActive)}
      >
        {hasMedia ? (
          <MediaPreview media={msg.media} />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: isOwn ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: 1.5,
              maxWidth: isMobile ? "92%" : "75%",
            }}
          >
            <Avatar
              src={`https://robohash.org/${msg.username}?set=set4`}
              sx={{
                width: 32,
                height: 32,
                mb: 0.5,
                border: `1px solid ${theme.palette.background.default}`,
              }}
            />

            <Box sx={{ position: "relative" }}>
              <Paper
                elevation={0}
                sx={{
                  p: "10px 16px",
                  borderRadius: "20px",
                  borderBottomRightRadius: isOwn ? 4 : 20,
                  borderBottomLeftRadius: isOwn ? 20 : 4,
                  bgcolor: isOwn ? "primary.main" : "background.paper",
                  color: isOwn ? "#fff" : "text.primary",
                  border: isOwn ? "none" : `1px solid ${theme.palette.divider}`,
                  boxShadow: "none",
                  transition: "transform 0.1s ease",
                  "&:active": { transform: "scale(0.98)" },
                }}
              >
                {!isOwn && msg.username && (
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 0.5, fontSize: "0.75rem" }}>
                    {msg.username}
                  </Typography>
                )}

                <MessageReplyPreview msg={msg} isOwn={isOwn} onClicReply={onClicReply} />

                {msg.content !== "" && (
                  <Box sx={{ mt: 0.5 }}>
                    <MessageText content={msg.content} />
                  </Box>
                )}
                <MessageMediaList files={msg.files} isOwn={isOwn} />
              </Paper>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.4,
                  px: 1,
                  textAlign: isOwn ? "right" : "left",
                  color: "text.secondary",
                  fontSize: "0.65rem",
                }}
              >
                {formattedTime}
              </Typography>

              {(isActive || !isMobile) && (
                <Box sx={{ [isOwn ? "right" : "left"]: 0, zIndex: 10 }}>
                  <ReplyMenu
                    msg={msg}
                    senderId={senderId}
                    onReply={onReply}
                    roomName={roomName}
                    msgRef={msgRef}
                    handleCallMedia={handleCallMedia}
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </ListItem>
    );
  }
);

export default MessageBubble;