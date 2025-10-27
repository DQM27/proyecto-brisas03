import api from "@/src/lib/axios";
import { z } from "zod";
import { createIngresoSchema, updateIngresoSchema, responseIngresoSchema } from "@/src/app/schemas/ingresos.schema";

const getUserId = (): number => {
  return 1; // fallback temporal
};

// Normaliza un ingreso para que Zod no rompa
const normalizeIngreso = (ingreso: any) => ({
  ...ingreso,
  contratistaId: ingreso.contratistaId ?? undefined,
  vehiculoId: ingreso.vehiculoId ?? null,
  gafeteId: ingreso.gafeteId ?? null,
  usuarioRegistroId: ingreso.usuarioRegistroId ?? undefined,
  activo: ingreso.activo ?? undefined,
  contratista: ingreso.contratista ?? undefined,
  vehiculo: ingreso.vehiculo ?? null,
  gafete: ingreso.gafete ?? null,
});

// Crear ingreso
export const createIngreso = async (payload: z.infer<typeof createIngresoSchema>) => {
  const usuarioId = getUserId();
  const { data } = await api.post(`/ingresos?usuarioId=${usuarioId}`, payload);
  return responseIngresoSchema.parse(normalizeIngreso(data));
};

// Actualizar ingreso
export const updateIngreso = async (id: number, payload: z.infer<typeof updateIngresoSchema>) => {
  const { data } = await api.patch(`/ingresos/${id}`, payload);
  return responseIngresoSchema.parse(normalizeIngreso(data));
};

// Obtener todos los ingresos
export const getIngresos = async () => {
  const { data } = await api.get("/ingresos");
  const normalizados = (data as any[]).map(normalizeIngreso);
  return z.array(responseIngresoSchema).parse(normalizados);
};

// Obtener ingreso por ID
export const getIngreso = async (id: number) => {
  const { data } = await api.get(`/ingresos/${id}`);
  return responseIngresoSchema.parse(normalizeIngreso(data));
};

// Registrar salida de un contratista
export const registrarSalida = async (contratistaId: number) => {
  const usuarioId = getUserId();
  const { data } = await api.patch(`/ingresos/${contratistaId}/salida?usuarioId=${usuarioId}`);
  return responseIngresoSchema.parse(normalizeIngreso(data));
};
