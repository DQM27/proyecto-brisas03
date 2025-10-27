import { z } from "zod";
import { EstadoGafete, EstadoDevolucionGafete, TipoGafete } from "@/src/common/enums/gafetes.enums";

export const gafeteSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  tipo: z.nativeEnum(TipoGafete),
  estado: z.nativeEnum(EstadoGafete).optional(),
  estadoDevolucion: z.nativeEnum(EstadoDevolucionGafete).optional(),
  contratistaId: z.number().optional(),
  fechaCreacion: z.string().transform(s => new Date(s)),
  fechaActualizacion: z.string().transform(s => new Date(s)),
  fechaEliminacion: z.union([z.string(), z.null(), z.undefined()]).transform(s => s ? new Date(s) : undefined),
});

// Crear y actualizar
export const createGafeteSchema = gafeteSchema.omit({ id: true, fechaCreacion: true, fechaActualizacion: true, fechaEliminacion: true });
export const updateGafeteSchema = createGafeteSchema.partial();

// Respuesta y array
export const responseGafeteSchema = gafeteSchema;
export const gafetesArraySchema = z.array(gafeteSchema);

// Tipos
export type Gafete = z.infer<typeof gafeteSchema>;
export type CreateGafeteDto = z.infer<typeof createGafeteSchema>;
export type UpdateGafeteDto = z.infer<typeof updateGafeteSchema>;
