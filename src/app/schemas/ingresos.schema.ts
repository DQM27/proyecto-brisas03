// src/app/schemas/ingresos.schema.ts
import { z } from "zod";

// ----------------------
// Sub-objetos
// ----------------------
export const contratistaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  identificacion: z.string(),
});

export const vehiculoSchema = z.object({
  id: z.number(),
  placa: z.string(),
}).nullable();

export const gafeteSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  estado: z.string(),
}).nullable();

export const puntoAccesoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
}).nullable();

export const usuarioSchema = z.object({
  id: z.number(),
  nombreCompleto: z.string(),
}).nullable();

// ----------------------
// Ingreso principal
// ----------------------
export const responseIngresoSchema = z.object({
  id: z.number(),
  contratista: contratistaSchema,
  vehiculo: vehiculoSchema.optional(),
  gafete: gafeteSchema.optional(),
  puntoEntrada: puntoAccesoSchema.optional(),
  puntoSalida: puntoAccesoSchema.optional(),
  tipoAutorizacion: z.enum(["AUTOMATICA", "MANUAL"]),
  fechaIngreso: z.string(),
  fechaSalida: z.string().nullable().optional(),
  ingresadoPor: usuarioSchema,
  sacadoPor: usuarioSchema.optional(),
  dentroFuera: z.boolean(),
  observaciones: z.string().nullable().optional(),
  fechaCreacion: z.string(),
  fechaActualizacion: z.string(),
  fechaEliminacion: z.string().nullable().optional(),
  duracion: z.string().optional(),
});

// ----------------------
// Schemas para crear / actualizar
// ----------------------
export const createIngresoSchema = z.object({
  contratistaId: z.number(),
  gafeteId: z.number().optional(),
  vehiculoId: z.number().optional(),
  observaciones: z.string().optional(),
  tipoAutorizacion: z.enum(["AUTOMATICA", "MANUAL"]).optional(),
});

export const updateIngresoSchema = z.object({
  observaciones: z.string().optional(),
  tipoAutorizacion: z.enum(["AUTOMATICA", "MANUAL"]).optional(),
});

// ----------------------
// TIPOS TYPESCRIPT
// ----------------------
export type ResponseIngreso = z.infer<typeof responseIngresoSchema>;
export type CreateIngreso = z.infer<typeof createIngresoSchema>;
export type UpdateIngreso = z.infer<typeof updateIngresoSchema>;
