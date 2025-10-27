import * as z from "zod";
import { RolUsuario } from "../../common/enums/rol-usuario.enum"; // Ajusta la ruta a tu enum

export const createUsuarioSchema = z.object({
  primerNombre: z.string().min(1, "El primer nombre es obligatorio"),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(1, "El primer apellido es obligatorio"),
  segundoApellido: z.string().optional(),
  cedula: z.string().min(1, "La cédula es obligatoria"),
  email: z.string().email("Correo inválido"),
  telefono: z.string().optional(),
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  rol: z.nativeEnum(RolUsuario).optional(),
});
