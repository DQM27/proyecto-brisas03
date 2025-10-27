import { z } from "zod";
import { responseContratistaSchema } from "./contratistas.schema";
import { responseVehiculoSchema } from "./vehiculos.schema";
import { responseGafeteSchema } from "./gafetes.schema";

// Enum tipoAutorizacion
export const tipoAutorizacionSchema = z.enum(['MANUAL', 'AUTOMATICA', 'TEMPORAL']);

// Crear ingreso
export const createIngresoSchema = z.object({
  contratistaId: z.number().int(),
  vehiculoId: z.number().int().optional(),
  gafeteId: z.number().int(),
  puntoEntradaId: z.number().int().optional(),
  tipoAutorizacion: tipoAutorizacionSchema.optional(),
  observaciones: z.string().max(500).optional(),
});

// Actualizar ingreso
export const updateIngresoSchema = createIngresoSchema.partial();

// Respuesta de ingreso
export const responseIngresoSchema = z.object({
  id: z.number(),
  contratistaId: z.number().optional(),
  vehiculoId: z.number().nullable().optional(),
  gafeteId: z.number().nullable().optional(),
  fechaIngreso: z.string().transform(str => new Date(str)),
  fechaSalida: z.string().nullable().transform(str => str ? new Date(str) : null),
  usuarioRegistroId: z.number().optional(),
  activo: z.boolean().optional(),
  observaciones: z.string().nullable(),
  fechaCreacion: z.string().transform(str => new Date(str)),
  fechaActualizacion: z.string().transform(str => new Date(str)),
  fechaEliminacion: z.string().nullable().transform(str => str ? new Date(str) : null),

  // Relaciones
  contratista: responseContratistaSchema.optional(),
  vehiculo: responseVehiculoSchema.nullable().optional(),
  gafete: responseGafeteSchema.nullable().optional(),
});

// Tipos inferidos
export type Ingreso = z.infer<typeof responseIngresoSchema>;
export type CreateIngresoDto = z.infer<typeof createIngresoSchema>;
export type UpdateIngresoDto = z.infer<typeof updateIngresoSchema>;
