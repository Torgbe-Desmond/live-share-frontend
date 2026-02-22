import { List } from "@mui/material";
import MessageBubble from "./MessageBubble";

export default function MessagesList({ messages, senderId, bottomRef, onReply }) {
  return (
    <List disablePadding sx={{ mt: "auto" }}>
      {messages.map((msg, index) => (
        <MessageBubble key={`${msg.senderId}-${index}`} msg={msg} senderId={senderId} onReply={onReply} />
      ))}
      <div ref={bottomRef} />
    </List>
  );
}