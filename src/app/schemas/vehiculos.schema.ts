import { z } from "zod";

// Enum TipoVehiculo
export const tipoVehiculoEnum = z.enum([
  "AUTOMOVIL",
  "MOTOCICLETA",
  "CAMION",
  "OTRO"
]);

export type TipoVehiculo = z.infer<typeof tipoVehiculoEnum>;

// Schema crear vehículo
export const createVehiculoSchema = z.object({
  contratistaId: z.number().optional(),
  tipo: tipoVehiculoEnum,
  marca: z.string().max(100),
  color: z.string().max(50),
  numeroPlaca: z.string().max(20),
  tieneLicencia: z.boolean().optional(),
  dekraAlDia: z.boolean().optional(),
  marchamoAlDia: z.boolean().optional(),
});

// Schema actualizar vehículo
export const updateVehiculoSchema = createVehiculoSchema.partial();

// Schema de respuesta
export const responseVehiculoSchema = z.object({
  id: z.number(),
  contratistaId: z.number().optional(),
  tipo: tipoVehiculoEnum,
  marca: z.string(),
  color: z.string(),
  numeroPlaca: z.string(),
  tieneLicencia: z.boolean().optional(),
  dekraAlDia: z.boolean().optional(),
  marchamoAlDia: z.boolean().optional(),
  activo: z.boolean(),
  fechaCreacion: z.string().transform(str => new Date(str)),
  fechaActualizacion: z.string().transform(str => new Date(str)),
  fechaEliminacion: z.string().nullable().optional().transform(str => str ? new Date(str) : null),
});

// Array
export const vehiculosArraySchema = z.array(responseVehiculoSchema);

// Tipos
export type Vehiculo = z.infer<typeof responseVehiculoSchema>;
export type CreateVehiculoDto = z.infer<typeof createVehiculoSchema>;
export type UpdateVehiculoDto = z.infer<typeof updateVehiculoSchema>;
