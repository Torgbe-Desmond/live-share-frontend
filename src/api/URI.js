export const API_BASE =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://live-share-wpw8.onrender.com"
    : "http://localhost:5000";
