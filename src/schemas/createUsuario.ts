// src/lib/dto/create-usuario.schema.ts
import { z } from "zod";

export const createUsuarioSchema = z.object({
  primerNombre: z
    .string()
    .min(1, "Requerido")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "Solo letras y espacios"),

  segundoNombre: z
    .string()
    .optional()
    .refine((val) => !val || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(val), {
      message: "Solo letras y espacios",
    }),

  primerApellido: z
    .string()
    .min(1, "Requerido")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, "Solo letras y espacios"),

  segundoApellido: z
    .string()
    .optional()
    .refine((val) => !val || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(val), {
      message: "Solo letras y espacios",
    }),

  cedula: z
    .string()
    .regex(/^[0-9-]+$/, "Solo números y guiones")
    .min(9, "Mínimo 9 caracteres")
    .max(12, "Máximo 12 caracteres"),

  email: z.string().email("Email inválido"),

  telefono: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{4}-[0-9]{4}$/.test(val), {
      message: "Formato: 0000-0000",
    }),

  password: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, "Letras + números"),

  rol: z.enum(["ADMIN", "SUPERVISOR", "SEGURIDAD", "OPERADOR"]).optional(),
});

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;