import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:5000/api/",
});

makeRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
