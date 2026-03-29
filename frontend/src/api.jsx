import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token && req.headers) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const login    = (data) => API.post("/login", data);
export const register = (data) => API.post("/register", data);

// Admin — users
export const getUsers   = ()     => API.get("/admin/users");
export const addUser    = (data) => API.post("/admin/add-user", data);
export const deleteUser = (id)   => API.delete(`/admin/delete-user/${id}`);

// Admin — products
export const addProduct    = (data) => API.post("/admin/products", data);
export const deleteProduct = (id)   => API.delete(`/admin/products/${id}`);

// User — products & cart
export const getProducts     = ()              => API.get("/products");
export const getCart         = ()              => API.get("/cart");
export const addToCart       = (id, qty)       => API.post(`/cart/add/${id}?quantity=${qty}`);
export const removeFromCart  = (id)            => API.delete(`/cart/remove/${id}`);