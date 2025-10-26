import api from "@/src/lib/axios"; // tu instancia de Axios configurada
import { usuarioSchema, usuariosArraySchema } from "@/src/app/schemas/usuarioSchemas";
import { z } from "zod";

// Obtener todos los usuarios (incluyendo eliminados)
export const getUsuarios = async () => {
  const { data } = await api.get("/usuarios", {
    params: { includeDeleted: 'true' } // ⬅️ AGREGADO
  });
  return usuariosArraySchema.parse(data); // valida y transforma
};

// Crear un usuario
export const createUsuario = async (payload: z.infer<typeof usuarioSchema>) => {
  const { data } = await api.post("/usuarios", payload);
  return usuarioSchema.parse(data);
};

// Actualizar usuario (partial)
export const updateUsuario = async (id: number, payload: Partial<z.infer<typeof usuarioSchema>>) => {
  const { data } = await api.patch(`/usuarios/${id}`, payload);
  return usuarioSchema.parse(data);
};

// Eliminar usuario
export const deleteUsuario = async (id: number) => {
  await api.delete(`/usuarios/${id}`);
  return { message: "Usuario eliminado correctamente" };
};

// Restaurar usuario eliminado lógicamente
export const restoreUsuario = async (id: number) => {
  const { data } = await api.post(`/usuarios/${id}/restore`);
  return usuarioSchema.parse(data);
};