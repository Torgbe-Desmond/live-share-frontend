import { List } from "@mui/material";
import MessageBubble from "./MessageBubble";

export default function MessagesList({
  messages,
  senderId,
  bottomRef,
  onReply,
  onClickReply,
  onMediaViewed,
  roomName,
}) {
  return (
    <List
      disablePadding
      sx={{
        mt: "auto",
        display: "flex",
        flexDirection: "column",
        py: 1,
      }}
    >
      {messages.map((msg, index) => (
        <MessageBubble
          key={`${msg.senderId}-${index}`}
          msg={msg}
          senderId={senderId}
          onReply={onReply}
          onClickReply={onClickReply}
          onMediaViewed={onMediaViewed}
          roomName={roomName}
        />
      ))}
      <div ref={bottomRef} />
    </List>
  );
}
