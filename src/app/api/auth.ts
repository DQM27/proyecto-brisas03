import axios, { AxiosError } from "axios";
import { changePasswordSchema } from "../../schemas/changePassword";
import { z } from "zod";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tipos de respuesta del backend
interface LoginResponse {
  accessToken: string;
}

// Login
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    return data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw err.response?.data?.message || "Error desconocido";
  }
};

// Logout
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};



export const changePassword = async (dto: z.infer<typeof changePasswordSchema>) => {
  try {
    await api.patch("/usuarios/change-password", dto);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "No se pudo cambiar la contraseña"
    );
  }
};

// src/lib/api.ts
export const getMyProfile = async () => {
  const { data } = await api.get("/usuarios/me"); // ← Backend debe tener este endpoint
  return data;
};

export const updateMyProfile = async (dto: any) => {
  const { data } = await api.patch("/usuarios/me", dto);
  return data;
};

export const changeMyPassword = async (dto: { passwordActual: string; nuevaPassword: string }) => {
  await api.patch("/usuarios/change-password", dto);
};

export default api;
