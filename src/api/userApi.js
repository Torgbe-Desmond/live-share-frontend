// src/api/userApi.js
const API_BASE =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://live-share-5bkp.onrender.com"
    : "http://127.20.10.2:5000";

const BASE_URL = `${API_BASE}/api/users`;
/**
 * Create a new user
 */
export async function createUser(username) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to create user");
  }

  const data = await response.json();

  return data;
}

/**
 * Delete user
 */
export async function deleteUser(userId) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${BASE_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete user");
  }

  // Cleanup local storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("roomName");

  return true;
}
