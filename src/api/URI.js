export const API_BASE =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://playground-jyef.onrender.com"
    : "http://127.20.10.2:5000";