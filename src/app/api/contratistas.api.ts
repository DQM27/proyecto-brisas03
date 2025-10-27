// src/app/api/contratistas.api.ts
import api from "@/src/lib/axios";
import {
  responseContratistaSchema,
  contratistasArraySchema,
  type CreateContratistaDto,
  type UpdateContratistaDto,
  type Contratista
} from "@/src/app/schemas/contratistas.schema";

// Normalizar el nombre completo
export const normalizeContratista = (c: Contratista) => ({
  ...c,
  nombre: `${c.primerNombre} ${c.primerApellido}`,
});

// Obtener todos los contratistas
export const getContratistas = async (): Promise<Contratista[]> => {
  const { data } = await api.get("/contratistas");
  const parsed = contratistasArraySchema.parse(data);
  return parsed.map(normalizeContratista);
};

// Obtener contratista por ID
export const getContratista = async (id: number): Promise<Contratista> => {
  const { data } = await api.get(`/contratistas/${id}`);
  const parsed = responseContratistaSchema.parse(data);
  return normalizeContratista(parsed);
};

// Crear contratista
export const createContratista = async (payload: CreateContratistaDto): Promise<Contratista> => {
  const { data } = await api.post("/contratistas", payload);
  const parsed = responseContratistaSchema.parse(data);
  return normalizeContratista(parsed);
};

// Actualizar contratista
export const updateContratista = async (id: number, payload: UpdateContratistaDto): Promise<Contratista> => {
  const { data } = await api.patch(`/contratistas/${id}`, payload);
  const parsed = responseContratistaSchema.parse(data);
  return normalizeContratista(parsed);
};

// Eliminar contratista (soft delete)
export const deleteContratista = async (id: number) => {
  await api.delete(`/contratistas/${id}`);
};

// Restaurar contratista
export const restoreContratista = async (id: number): Promise<Contratista> => {
  const { data } = await api.patch(`/contratistas/${id}/restore`);
  const parsed = responseContratistaSchema.parse(data);
  return normalizeContratista(parsed);
};
