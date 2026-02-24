import { API_BASE } from "./URI";

const BASE_URL = `${API_BASE}/api/messages`;

export async function uploadFile(formData) {
  if (!formData) {
    return { success: false, error: "No file selected" };
  }

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!response.ok) {
      throw new Error(result?.error || `Upload failed: ${response.status}`);
    }


    return { success: true, data: result.data };
  } catch (error) {
    console.error("Upload error:", error);  
    return {
      success: false,
      error: error.message || "Failed to upload file. Please try again.",
    };
  }
}