import { API_BASE } from "./URI";

const BASE_URL = `${API_BASE}/api/media/download`;

export async function getTiktokMedia(url, roomName, messageId) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, roomName, messageId }),
      credentials: "include",
    });

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!response.ok) {
      throw new Error(result?.error || `download failed: ${response.status}`);
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to download file. Please try again.",
    };
  }
}
