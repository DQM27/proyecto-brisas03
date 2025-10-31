import { z } from 'zod';

/**
 * Enums que coinciden con el backend
 */
export const TipoAutorizacionEnum = z.enum(['AUTOMATICA', 'MANUAL']);
export const EstadoDevolucionGafeteEnum = z.enum(['BUENO', 'DAÑADO', 'PERDIDO']);
export const EstadoGafeteEnum = z.enum(['ACTIVO', 'INACTIVO', 'EN_REPARACION', 'PERDIDO']);

export type TipoAutorizacion = z.infer<typeof TipoAutorizacionEnum>;
export type EstadoDevolucionGafete = z.infer<typeof EstadoDevolucionGafeteEnum>;
export type EstadoGafete = z.infer<typeof EstadoGafeteEnum>;

/**
 * Schema para Contratista (datos anidados en respuesta)
 */
const ContratistaSchema = z.object({
  id: z.number(),
  nombreCompleto: z.string(),
  cedula: z.string(),
  primerNombre: z.string(),
  primerApellido: z.string(),
});

/**
 * Schema para Vehículo (datos anidados en respuesta)
 */
const VehiculoSchema = z.object({
  id: z.number(),
  placa: z.string(),
});

/**
 * Schema para Gafete (datos anidados en respuesta)
 */
const GafeteSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  estado: EstadoGafeteEnum,
});

/**
 * Schema para Punto de Acceso (datos anidados en respuesta)
 */
const PuntoAccesoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
});

/**
 * Schema para Usuario (datos anidados en respuesta)
 */
const UsuarioSchema = z.object({
  id: z.number(),
  nombreCompleto: z.string(),
});

/**
 * Schema para crear un ingreso (request)
 */
export const CreateIngresoSchema = z.object({
  contratistaId: z.number({
    required_error: 'El ID del contratista es obligatorio',
    invalid_type_error: 'El ID del contratista debe ser un número',
  }).int('El ID del contratista debe ser un número entero').positive('El ID del contratista debe ser positivo'),
  
  vehiculoId: z.number().int().positive().optional(),
  
  gafeteId: z.number().int().positive().optional(),
  
  puntoEntradaId: z.number().int().positive().optional(),
  
  tipoAutorizacion: TipoAutorizacionEnum.optional(),
  
  observaciones: z.string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
    .optional(),
});

export type CreateIngresoDto = z.infer<typeof CreateIngresoSchema>;

/**
 * Schema para actualizar un ingreso (request)
 */
export const UpdateIngresoSchema = z.object({
  tipoAutorizacion: TipoAutorizacionEnum.optional(),
  observaciones: z.string().max(500).optional(),
});

export type UpdateIngresoDto = z.infer<typeof UpdateIngresoSchema>;

/**
 * Schema para la respuesta de un ingreso
 */
export const ResponseIngresoSchema = z.object({
  id: z.number(),
  
  contratista: ContratistaSchema,
  
  vehiculo: VehiculoSchema.nullable(),
  
  gafete: GafeteSchema.nullable(),
  
  puntoEntrada: PuntoAccesoSchema.nullable(),
  
  puntoSalida: PuntoAccesoSchema.nullable(),
  
  tipoAutorizacion: TipoAutorizacionEnum,
  
  fechaIngreso: z.string().datetime(),
  
  fechaSalida: z.string().datetime().nullable(),
  
  ingresadoPor: UsuarioSchema,
  
  sacadoPor: UsuarioSchema.nullable().optional(), // ✅ Puede ser null O undefined
  
  dentroFuera: z.boolean(),
  
  observaciones: z.string().nullable().optional(), // ✅ Puede ser null O undefined
  
  duracion: z.string().optional(),
  
  fechaCreacion: z.string().datetime(),
  
  fechaActualizacion: z.string().datetime(),
  
  fechaEliminacion: z.string().datetime().nullable().optional(),
});

export type ResponseIngreso = z.infer<typeof ResponseIngresoSchema>;

/**
 * Schema para respuesta paginada de ingresos
 */
export const PaginatedIngresosSchema = z.object({
  data: z.array(ResponseIngresoSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
});

export type PaginatedIngresos = z.infer<typeof PaginatedIngresosSchema>;

/**
 * Schema para errores del backend
 */
export const ErrorResponseSchema = z.object({
  message: z.union([z.string(), z.array(z.string())]),
  errorCode: z.string().optional(),
  timestamp: z.string().optional(),
  statusCode: z.number().optional(),
  error: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;