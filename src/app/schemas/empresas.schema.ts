import { z } from "zod";

export const empresaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  cedulaJuridica: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  correo: z.string().nullable().optional(),
  direccion: z.string().nullable().optional(),
  activo: z.boolean().optional(),

  fechaCreacion: z.string().transform(s => new Date(s)),
  fechaActualizacion: z.string().transform(s => new Date(s)),
  fechaEliminacion: z.union([z.string(), z.null(), z.undefined()])
    .transform(s => s ? new Date(s) : undefined),
});

export const createEmpresaSchema = empresaSchema.omit({
  id: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  fechaEliminacion: true,
});

export const updateEmpresaSchema = createEmpresaSchema.partial();

export const responseEmpresaSchema = empresaSchema;
export const empresasArraySchema = z.array(empresaSchema);

export type Empresa = z.infer<typeof empresaSchema>;
export type CreateEmpresaDto = z.infer<typeof createEmpresaSchema>;
export type UpdateEmpresaDto = z.infer<typeof updateEmpresaSchema>;
