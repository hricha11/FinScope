import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.REACT_APP_API_BASE_URL ||
  "http://localhost:8080";

let unauthorizedHandler: (() => void) | null = null;

export const setAuthToken = (token: string) => {
  localStorage.setItem("finscope_token", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("finscope_token");
};

export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Always read latest JWT from localStorage before request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("finscope_token");

  if (!config.headers) config.headers = {} as any;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthToken();
      unauthorizedHandler?.();
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;
