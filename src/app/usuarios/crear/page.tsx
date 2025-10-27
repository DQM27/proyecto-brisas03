"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/src/lib/axios"; // <-- tu instancia configurada
import axios from "axios";          // <-- axios real para isAxiosError
import { createUsuarioSchema } from "../../schemas/createUsuario";
import { z } from "zod";
import { RolUsuario } from "../../../common/enums/rol-usuario.enum";

// Tipado del formulario usando Zod
type CreateUsuarioForm = z.infer<typeof createUsuarioSchema>;

export default function CrearUsuarioPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUsuarioForm>({
    resolver: zodResolver(createUsuarioSchema),
  });

  const onSubmit = async (data: CreateUsuarioForm) => {
    try {
      const response = await api.post("/usuarios", data);
      alert(`Usuario creado exitosamente: ${response.data.email}`);
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("Ocurrió un error al crear el usuario");
        }
      } else {
        alert("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Crear Usuario</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Primer Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primer Nombre *
            </label>
            <input
              type="text"
              {...register("primerNombre")}
              className={`mt-1 w-full p-2 border rounded-lg ${
                errors.primerNombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.primerNombre && (
              <p className="text-red-500 text-sm mt-1">{errors.primerNombre.message}</p>
            )}
          </div>

          {/* Segundo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Segundo Nombre
            </label>
            <input
              type="text"
              {...register("segundoNombre")}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Primer Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primer Apellido *
            </label>
            <input
              type="text"
              {...register("primerApellido")}
              className={`mt-1 w-full p-2 border rounded-lg ${
                errors.primerApellido ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.primerApellido && (
              <p className="text-red-500 text-sm mt-1">{errors.primerApellido.message}</p>
            )}
          </div>

          {/* Segundo Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Segundo Apellido
            </label>
            <input
              type="text"
              {...register("segundoApellido")}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Cédula */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cédula *
            </label>
            <input
              type="text"
              {...register("cedula")}
              className={`mt-1 w-full p-2 border rounded-lg ${
                errors.cedula ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cedula && (
              <p className="text-red-500 text-sm mt-1">{errors.cedula.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 w-full p-2 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              {...register("telefono")}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña *
            </label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 w-full p-2 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              {...register("rol")}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
            >
              {Object.values(RolUsuario).map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
