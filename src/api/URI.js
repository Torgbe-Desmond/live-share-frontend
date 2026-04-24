export const API_BASE =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://live-share-2jnx.onrender.com"
    : "http://localhost:5000";

export const API_URL =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? "https://models-0chn.onrender.com/predict" : "http://localhost:8000/code-detect/predict"


// export const API_BASE = "https://live-share-wpw8.onrender.com"
// export const API_URL = "https://models-0chn.onrender.com/predict"

