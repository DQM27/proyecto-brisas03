import axios, { AxiosError } from "axios";

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

export default api;
