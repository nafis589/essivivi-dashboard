import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        // Only access localStorage in the browser
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors (like 401)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Handle 401 Unauthorized globally if needed (e.g., redirect to login)
        // For now, we just reject the error so the calling component can handle it
        if (error.response && error.response.status === 401) {
            // Optional: Setup token refresh logic here
        }
        return Promise.reject(error);
    }
);
