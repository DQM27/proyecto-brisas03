import * as z from "zod";

export const changePasswordSchema = z.object({
  passwordActual: z.string().min(1, "Debe ingresar su contraseña actual"),
  nuevaPassword: z.string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
});
