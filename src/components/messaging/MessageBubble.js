import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  ListItem,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Import your sub-components
import MessageReplyPreview from "./preview/MessageReplyPreview";
import MessageText from "./message/MessageText";
import ReplyMenu from "./action/ReplyMenu";
import MessageMediaList from "./media/MessageMediaList";

const MessageBubble = forwardRef(
  ({ msg, senderId, onReply, onMediaViewed, onClicReply }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isOwn = msg.senderId === senderId;

    const msgRef = useRef(msg);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      msgRef.current = msg;
    }, [msg]);

    return (
      <ListItem
        ref={ref}
        disablePadding
        sx={{
          px: isMobile ? 1 : 2,
          py: 0.5,
          justifyContent: isOwn ? "flex-end" : "flex-start",
          // Subtle hover/active state using theme colors
          bgcolor: isActive ? "action.selected" : "transparent",
          transition: "background-color 0.2s ease",
        }}
        onClick={() => isMobile && setIsActive(!isActive)}
      >
       

        <Box
          sx={{
            display: "flex",
            flexDirection: isOwn ? "row-reverse" : "row",
            alignItems: "flex-end",
            gap: 1.5,
            maxWidth: isMobile ? "92%" : "75%",
          }}
        >
          {/* Avatar - Keeping the border thin to fit the dark theme */}
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

                // Color Logic: Use primary for own, background.paper for others
                bgcolor: isOwn ? "primary.main" : "background.paper",
                color: isOwn ? "#fff" : "text.primary",

                // Twitter-style border for incoming messages
                border: isOwn ? "none" : `1px solid ${theme.palette.divider}`,

                boxShadow: "none", // Remove shadows for a flatter, modern Twitter look
                transition: "transform 0.1s ease",
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              {!isOwn && (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary", // Muted gray for usernames
                    display: "block",
                    mb: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  {msg.username}
                </Typography>
              )}

              <MessageReplyPreview
                msg={msg}
                isOwn={isOwn}
                onClicReply={onClicReply}
              />

              <Box sx={{ mt: 0.5 }}>
                
                <MessageText content={msg.content} />
              </Box>

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
              12:45 PM
            </Typography>

            {/* Actions Overlay */}
            {(isActive || !isMobile) && (
              <Box
                sx={{
                  // position: "absolute",
                  // top: -30,
                  [isOwn ? "right" : "left"]: 0,
                  zIndex: 10,
                }}
              >
                <ReplyMenu
                  msg={msg}
                  senderId={senderId}
                  onReply={onReply}
                  msgRef={msgRef}
                />
              </Box>
            )}
          </Box>
        </Box>
      </ListItem>
    );
  },
);

export default MessageBubble;
