export const API_BASE =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://play-ground-l94k.onrender.com"
    : "http://localhost:5000";
