// src/app/api/usuariosApi.ts
import api from "@/src/lib/axios";
import { z } from "zod";
import {
  usuarioSchema,
  usuariosArraySchema,
} from "@/src/app/schemas/usuarioSchemas";

// ✅ Tipos derivados de Zod
export type Usuario = z.infer<typeof usuarioSchema>;
export type UsuarioUpdate = Partial<Usuario>;

// ------------------------------------------------------
// ✅ Obtener todos los usuarios (incluyendo eliminados)
// ------------------------------------------------------
export const getUsuarios = async (): Promise<Usuario[]> => {
  const { data } = await api.get("/usuarios", {
    params: { includeDeleted: "true" },
  });

  return usuariosArraySchema.parse(data);
};

// ------------------------------------------------------
// ✅ Crear usuario nuevo
// ------------------------------------------------------
export const createUsuario = async (payload: Usuario): Promise<Usuario> => {
  const { data } = await api.post("/usuarios", payload);
  return usuarioSchema.parse(data);
};

// ------------------------------------------------------
// ✅ Actualizar usuario (solo campos enviados)
//    Usamos .partial() para permitir actualizaciones parciales
// ------------------------------------------------------
const usuarioUpdateSchema = usuarioSchema.partial();

export const updateUsuario = async (
  id: number,
  payload: UsuarioUpdate
): Promise<Usuario> => {
  const parsed = usuarioUpdateSchema.parse(payload);
  const { data } = await api.patch(`/usuarios/${id}`, parsed);
  return usuarioSchema.parse(data);
};

// ------------------------------------------------------
// ✅ Eliminación lógica
// ------------------------------------------------------
export const deleteUsuario = async (id: number): Promise<{ message: string }> => {
  await api.delete(`/usuarios/${id}`);
  return { message: "Usuario eliminado correctamente" };
};

// ------------------------------------------------------
// ✅ Restauración
// ------------------------------------------------------
export const restoreUsuario = async (id: number): Promise<Usuario> => {
  const { data } = await api.post(`/usuarios/${id}/restore`);
  return usuarioSchema.parse(data);
};
