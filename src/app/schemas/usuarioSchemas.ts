import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.number(),
  primerNombre: z.string(),
  segundoNombre: z.string().optional(),
  primerApellido: z.string(),
  segundoApellido: z.string().optional(),
  email: z.string().email(),
  cedula: z.string(), // 🔹 Ahora coincide con el DTO
  rol: z.string().optional(),
  activo: z.boolean(),
  fechaCreacion: z.string(),
  fechaActualizacion: z.string(),
  fechaEliminacion: z.string().nullable().optional(),
});

// Para arrays de usuarios
export const usuariosArraySchema = z.array(usuarioSchema);
