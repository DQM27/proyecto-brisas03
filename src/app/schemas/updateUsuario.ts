import * as z from "zod";
import { RolUsuario } from "../../common/enums/rol-usuario.enum"; // Ajusta la ruta

export const updateUsuarioSchema = z.object({
  primerNombre: z.string().min(1).optional(),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(1).optional(),
  segundoApellido: z.string().optional(),
  cedula: z.string().min(1).optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  rol: z.nativeEnum(RolUsuario).optional(),
});
