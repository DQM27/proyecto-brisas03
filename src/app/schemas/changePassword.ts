// src/app/schemas/changePasswordSchema.ts
import { z } from "zod";

export const changePasswordSchema = z.object({
  passwordActual: z
    .string()
    .min(1, "Debe ingresar la contraseña actual"),

  nuevaPassword: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .max(100, "Máximo 100 caracteres")
    .regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Debe tener mayúscula y número"),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;