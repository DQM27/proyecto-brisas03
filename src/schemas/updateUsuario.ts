// src/app/schemas/updateUsuarioSchema.ts
import { z } from "zod";

export const updateUsuarioSchema = z.object({
  primerNombre: z.string().optional(),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().optional(),
  segundoApellido: z.string().optional(),
  cedula: z.string().regex(/^[0-9-]+$/).min(9).max(12).optional(),
  email: z.string().email().optional(),
  telefono: z.string().regex(/^[0-9]{4}-[0-9]{4}$/).optional(),
  // fotoUrl: ... ← ELIMINADO
});

export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;