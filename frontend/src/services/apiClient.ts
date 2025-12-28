import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor (for adding auth tokens if needed in the future)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const user = localStorage.getItem("fleet_user");
    if (user) {
      const userData = JSON.parse(user);
      // Future: Add token to headers
      // config.headers.Authorization = `Bearer ${userData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for global error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth and redirect to login
      localStorage.removeItem("fleet_user");
      window.location.href = "/login";
    }

    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);
