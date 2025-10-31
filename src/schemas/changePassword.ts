// src/app/schemas/changePasswordSchema.ts
import { z } from "zod";

export const changePasswordSchema = z.object({
  passwordActual: z.string().min(1, "Requerido"),
  nuevaPassword: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Mayúscula + número"),
});