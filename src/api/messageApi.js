// src/api/messageApi.js
const BASE_URL = "http://127.20.10.2:5000/api/messages";

export const createMessageApi = async (data, files) => {
  const formData = new FormData();

  formData.append("sender_id", data.sender_id);
  formData.append("content", data.content);
  formData.append("roomName", data.roomName);

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

export const deleteMessageApi = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete message");
  }

  return response.json();
};