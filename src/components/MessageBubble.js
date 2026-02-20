import {
  Box,
  Paper,
  ListItem,
  Typography,
  Avatar,
  alpha,
  IconButton,
} from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';
export default function MessageBubble({ msg, senderId, onReply }) {
  const isOwn = msg.senderId === senderId;

  return (
    <ListItem
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
          alignItems: "flex-end",
          gap: 1.2,
          maxWidth: "80%",
        }}
      >
        <Avatar
          src={`https://robohash.org/${msg.username}?set=set4`}
          sx={{
            width: 36,
            height: 36,
            bgcolor: isOwn ? "primary.dark" : "grey.400",
          }}
        />
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 3,
            borderTopRightRadius: isOwn ? 0 : 12,
            borderTopLeftRadius: isOwn ? 12 : 0,
            bgcolor: isOwn ? "primary.main" : alpha("#fff", 0.98),
            color: isOwn ? "primary.contrastText" : "text.primary",
            boxShadow: isOwn
              ? "0 4px 12px rgba(25,118,210,0.28)"
              : "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, opacity: 0.8, mb: 0.4, display: "block" }}
          >
            {msg.username}
          </Typography>
          {msg?.replyTo && (
            <Box
              sx={{
                borderLeft: isOwn ? "3px solid #e0e0e0" : "3px solid #1976d2",
                pl: 1,
                mb: 1,
                opacity: 0.8,
              }}
            >
              <Typography variant="caption">{msg.replyTo.username}</Typography>
              <Typography variant="body2" noWrap>
                {msg.replyTo.content}
              </Typography>
            </Box>
          )}

          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            {msg.content}
          </Typography>
          {msg.files?.map((url, i) => (
            <Box key={i} mt={1.2} borderRadius={2} overflow="hidden">
              <img
                src={url}
                alt="attachment"
                style={{ maxWidth: "100%", display: "block" }}
              />
            </Box>
          ))}
          <IconButton
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
            }}
            onClick={() => onReply(msg)}
          >
            <ReplyIcon/>
          </IconButton>
        </Paper>
      </Box>
    </ListItem>
  );
}
