import axios from "axios";

// Base API
const API = axios.create({
  baseURL: "http://127.0.0.1:5000", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Add token automatically to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth endpoints
export const login = (data) => API.post("/login", data);
export const register = (data) => API.post("/register", data);

// Admin endpoints
export const getUsers = () => API.get("/admin/users");
export const addUser = (data) => API.post("/admin/add-user", data);
export const deleteUser = (id) => API.delete(`/admin/delete-user/${id}`);