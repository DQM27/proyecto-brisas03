// src/lib/api.ts
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { toast } from "sonner";

// === CONFIGURACIÓN DE AXIOS ===
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ← IMPORTANTE: para cookies httpOnly
});

// === INTERCEPTOR: Adjuntar token + refresh automático ===
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post<{ accessToken: string }>("/auth/refresh-token");
        localStorage.setItem("access_token", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("access_token");
        toast.error("Sesión expirada");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// === TIPOS ===
interface LoginResponse {
  accessToken: string;
}

interface ApiError {
  message: string;
}

// === HELPERS ===
const handleError = (error: unknown): never => {
  const err = error as AxiosError<ApiError>;
  const message = err.response?.data?.message || err.message || "Error desconocido";
  throw new Error(message);
};

// === AUTH ===
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    localStorage.setItem("access_token", data.accessToken); // ← GUARDADO
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }
};

// === PERFIL ===
export const getMyProfile = async () => {
  try {
    const { data } = await api.get("/usuarios/me");
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const updateMyProfile = async (dto: any) => {
  try {
    const { data } = await api.patch("/usuarios/me", dto);
    toast.success("¡Perfil actualizado!");
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const changeMyPassword = async (dto: { passwordActual: string; nuevaPassword: string }) => {
  try {
    await api.patch("/usuarios/change-password", dto);
    toast.success("¡Contraseña cambiada!");
  } catch (error) {
    handleError(error);
  }
};

// === SCHEMAS (opcional: mantener aquí o en carpeta schemas) ===
import { changePasswordSchema } from "@/src/schemas/changePassword";
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

export default api;