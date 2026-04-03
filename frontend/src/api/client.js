import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/live";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export const getFeed = () => api.get("/feed").then((r) => r.data);
export const getProcessedFeed = () =>
  api.get("/feed/processed").then((r) => r.data);
export const getDigest = () => api.get("/feed/digest").then((r) => r.data);
export const searchFeed = (query) =>
  api.post("/search", { query, n_results: 10 }).then((r) => r.data);
export const getProfile = () => api.get("/profile").then((r) => r.data);
export const updateProfile = (data) =>
  api.post("/profile", data).then((r) => r.data);
export { WS_URL };
