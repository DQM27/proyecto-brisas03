// src/lib/api.ts
import api from "@/src/lib/axios";
import { z } from "zod";
import { createUsuarioSchema } from "../../schemas/usuarioSchemas";

// === REGISTRO ===
export const register = async (dto: z.infer<typeof createUsuarioSchema>) => {
  const { data } = await api.post("/usuarios", dto);
  return data;
};

// === LOGIN ===
interface LoginResponse {
  access_token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
  return data;
};

// === LOGOUT (opcional) ===
export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("access_token");
};