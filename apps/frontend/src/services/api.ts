import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axios
    .post<{ success: boolean; data: { accessToken: string } }>(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    )
    .then(({ data }) => {
      const newToken = data.data.accessToken;
      setAccessToken(newToken);
      return newToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshAccessToken();
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken(null);
      window.dispatchEvent(new CustomEvent("auth:logout"));
      return Promise.reject(refreshError);
    }
  }
);
