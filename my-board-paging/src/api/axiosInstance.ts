import axios from "axios";

const api = axios.create({
  baseURL: "/api/board",
  headers: { "Content-Type": "multipart/form-data" },
});

export default api;
