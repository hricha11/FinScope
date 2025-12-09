import axios from "axios";
import { getAuthToken } from "../utils/authToken";
const apiClient = axios.create({
  baseURL: "http://localhost:8080", // your backend
});

// Attach Authorization header to every request
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
