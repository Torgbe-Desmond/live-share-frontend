import { useCallback, useEffect, useRef } from "react";
import socket from "../socket";

export default function useSocketListeners(
  senderId,
  setMessages,
  users,
  setUsers,
  setLeftMessage,
  setJoinedMessage,
  setFilesInChat
) {
  const userSocketsRef = useRef({});

  const handleUserJoin = useCallback(
    (data) => {
      if (data.userId === senderId?.toString()) return;
      if (!data?.username) return;

      setUsers((prev) =>
        prev.has(data.username) ? prev : new Set([...prev, data.username]),
      );

      if (!userSocketsRef.current[data.userId]) {
        userSocketsRef.current[data.userId] = data?.username;
        setJoinedMessage(`${data.username} has joined the room`);
      }
    },
    [senderId, setUsers, setJoinedMessage],
  );
  // ─── Receive message ─────────────
  const handleReceiveMessage = useCallback(
    (data) => {
      // Add viewed: false for view-once files when receiving
      const enrichedMessage = {
        ...data,
        files: data.files?.map((file) => ({
          ...file,
          viewed: false,
        })),
      };

      console.log("inside usescoket", data.files)

      if (data.files && data.files.size > 0) {
        setFilesInChat(prev => [...prev, ...data.files])
      }

      if (data.senderId !== senderId?.toString()) {
        setMessages((prev) => [...prev, enrichedMessage]);
      }

      if (data.senderId !== senderId?.toString()) {
        handleUserJoin({ userId: data.senderId, username: data.username });
      }
    },
    [senderId, setMessages, handleUserJoin, setFilesInChat],
  );

  // ─── New: Media viewed event ─────────────
  const handleMediaViewed = useCallback(
    ({ messageId, filePublicId, viewerId }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (!msg.id || msg.id !== messageId) return msg;

          return {
            ...msg,
            files: msg.files?.map((f) =>
              f.publicId === filePublicId ? { ...f, viewed: true } : f,
            ),
          };
        }),
      );

      if (viewerId !== senderId?.toString()) {
        console.log(`Your view-once media was viewed by someone`);
      }
    },
    [senderId, setMessages],
  );

  // ─── User left ─────────────
  const handleUserLeft = useCallback(
    (data) => {
      if (!data.username) return;

      setUsers((prev) => {
        if (!prev.has(data.username)) return prev;
        const updated = new Set(prev);
        updated.delete(data.username);
        setLeftMessage(`${data.username} has left the room`);
        return updated;
      });

      delete userSocketsRef.current[data.userId];
    },
    [setUsers, setLeftMessage],
  );

  // ─── Subscribe to socket events ─────────────
  useEffect(() => {
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("userJoined", handleUserJoin);
    socket.on("userLeft", handleUserLeft);
    socket.on("mediaViewed", handleMediaViewed);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("userJoined", handleUserJoin);
      socket.off("userLeft", handleUserLeft);
      socket.off("mediaViewed", handleMediaViewed);
    };
  }, [handleReceiveMessage, handleUserJoin, handleUserLeft, handleMediaViewed]);
}
