"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "../api/auth";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import { AxiosError } from "axios";

// Validación con Zod
const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await login(data.email, data.password);
      localStorage.setItem("accessToken", res.accessToken);
      router.push("/registro-ingresos"); // Redirige al módulo de ingresos
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setErrorMessage(err.response?.data?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Input de correo */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Correo"
              {...register("email")}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Input de contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password")}
              className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Mensaje de error general */}
          {errorMessage && (
            <p className="text-red-600 text-center text-sm">{errorMessage}</p>
          )}

          {/* Botón de login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
