import { z } from "zod";

// Esquema de un contratista
export const contratistaSchema = z.object({
  id: z.number(),
  primerNombre: z.string(),
  segundoNombre: z.string().nullable().optional(),
  primerApellido: z.string(),
  segundoApellido: z.string().nullable().optional(),
  cedula: z.string(),
  telefono: z.string().nullable().optional(),
  empresaId: z.number().nullable().optional(),
  fechaVencimientoPraind: z.string().nullable().optional(),
  activo: z.boolean().nullable().optional(),
  notas: z.string().nullable().optional(),

  // Fechas: transformar strings en Date, y aceptar null
  fechaCreacion: z.string().transform(s => new Date(s)),
  fechaActualizacion: z.string().transform(s => new Date(s)),
  fechaEliminacion: z.union([z.string(), z.null(), z.undefined()])
    .transform(s => (s ? new Date(s) : undefined)),
});

// Esquemas para creación y actualización (sin id ni fechas)
export const createContratistaSchema = contratistaSchema.omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  fechaEliminacion: true,
});

export const updateContratistaSchema = createContratistaSchema.partial();

// Esquema de respuesta
export const responseContratistaSchema = contratistaSchema;

// Array de contratistas
export const contratistasArraySchema = z.array(contratistaSchema);

// Tipos TypeScript
export type Contratista = z.infer<typeof contratistaSchema>;
export type CreateContratistaDto = z.infer<typeof createContratistaSchema>;
export type UpdateContratistaDto = z.infer<typeof updateContratistaSchema>;
