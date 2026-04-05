export const API_BASE =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://live-share-wpw8.onrender.com"
    : "http://localhost:5000";

export const API_URL =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "http://localhost:8000/code-detect/predict" : "https://models-0chn.onrender.com/predict"