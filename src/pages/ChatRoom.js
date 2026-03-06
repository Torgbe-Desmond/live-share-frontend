import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Box,
  List,
  Snackbar,
  Alert,
} from "@mui/material";

import MessageBubble from "../components/messaging/MessageBubble";
import MessageInput from "../components/messaging/MessageInput";
import { uploadFile } from "../api/fileApi";
import useSocketListeners from "../components/useSocketListeners";

export default function ChatRoom() {
  const {
    senderId,
    roomName,
    username,
    users,
    setUsers,
    showReconnect,
  } = useOutletContext();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [leftMessage, setLeftMessage] = useState("");
  const [joinedMessage, setJoinedMessage] = useState("");

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const messageRefs = useRef(new Map());

  useSocketListeners(
    senderId,
    setMessages,
    users,
    setUsers,
    setLeftMessage,
    setJoinedMessage
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!senderId || !roomName) return;
    if (!message.trim() && selectedFiles.size === 0) return;

    const selectedFile = [...selectedFiles][0];
    const messageId = Date.now().toString();

    const localMessageObject = {
      messageId,
      content: message.trim(),
      senderId,
      roomName,
      username,
      replyTo: replyingTo ? { ...replyingTo } : null,
      files: selectedFile ? [{ ...selectedFile, viewed: false }] : [],
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, localMessageObject]);

    const formData = new FormData();
    formData.append("content", message.trim());
    formData.append("senderId", senderId);
    formData.append("roomName", roomName);
    formData.append("username", username);
    formData.append("messageId", messageId);
    if (selectedFile) formData.append("file", selectedFile.file);
    if (replyingTo) formData.append("replyTo", JSON.stringify(replyingTo));

    setSelectedFiles(new Set());
    setReplyingTo(null);
    setMessage("");

    try {
      await uploadFile(formData);
    } catch (err) {
      console.error("Upload failed:", err);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const markFileAsViewed = (messageId, filePublicId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.messageId === messageId
          ? {
              ...msg,
              files: msg.files?.map((f) =>
                f.publicId === filePublicId ? { ...f, viewed: true } : f
              ),
            }
          : msg
      )
    );
  };

  return (
    <>
      {/* Messages scroll area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: 800 },
            maxWidth: 800,
            mx: "auto",
            px: { xs: 2, md: 4 },
            py: 2,
            mt: "auto",
          }}
        >
          <List disablePadding>
            {messages.map((msg, index) => (
              <MessageBubble
                key={`${msg.messageId}-${index}`}
                msg={msg}
                senderId={senderId}
                onReply={setReplyingTo}
                onMediaViewed={(filePublicId) =>
                  markFileAsViewed(msg.messageId, filePublicId)
                }
                onClickReply={(replyMsg) => {
                  if (replyMsg.replyTo?.messageId) {
                    const ref = messageRefs.current.get(replyMsg.replyTo.messageId);
                    ref?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                ref={(el) => el && messageRefs.current.set(msg.messageId, el)}
              />
            ))}
            <div ref={bottomRef} />
          </List>
        </Box>
      </Box>

      {/* Fixed input area */}
      <Box
        sx={{
          padding: "0px 8px 4px 8px",
          backgroundColor: "background.paper",
          width: "100%",
        }}
      >
        <Box sx={{ maxWidth: 700, mx: "auto" }}>
          {!showReconnect && (
            <MessageInput
              message={message}
              setMessage={setMessage}
              onSend={handleSend}
              fileInputRef={fileInputRef}
              selectedFilesCount={selectedFiles.size}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
          )}
        </Box>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={Boolean(leftMessage)}
        autoHideDuration={4000}
        onClose={() => setLeftMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setLeftMessage("")} severity="warning">
          {leftMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(joinedMessage)}
        autoHideDuration={4000}
        onClose={() => setJoinedMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setJoinedMessage("")} severity="info">
          {joinedMessage}
        </Alert>
      </Snackbar>
    </>
  );
}