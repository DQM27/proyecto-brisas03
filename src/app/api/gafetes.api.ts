import api from "@/src/lib/axios";
import {
  responseGafeteSchema,
  gafetesArraySchema,
  Gafete,
  CreateGafeteDto,
  UpdateGafeteDto,
} from "@/src/app/schemas/gafetes.schema";

// Normalizar fechas
const normalizeGafete = (g: Gafete) => g;

export const getGafetes = async (): Promise<Gafete[]> => {
  const { data } = await api.get("/gafetes");
  const parsed = gafetesArraySchema.parse(data);
  return parsed.map(normalizeGafete);
};

export const getGafeteById = async (id: number): Promise<Gafete> => {
  const { data } = await api.get(`/gafetes/${id}`);
  return normalizeGafete(responseGafeteSchema.parse(data));
};

export const createGafete = async (payload: CreateGafeteDto): Promise<Gafete> => {
  const { data } = await api.post("/gafetes", payload);
  return normalizeGafete(responseGafeteSchema.parse(data));
};

export const updateGafete = async (id: number, payload: UpdateGafeteDto): Promise<Gafete> => {
  const { data } = await api.patch(`/gafetes/${id}`, payload);
  return normalizeGafete(responseGafeteSchema.parse(data));
};

export const deleteGafete = async (id: number): Promise<void> => {
  await api.delete(`/gafetes/${id}`);
};

export const restoreGafete = async (id: number): Promise<Gafete> => {
  const { data } = await api.patch(`/gafetes/restore/${id}`);
  return normalizeGafete(responseGafeteSchema.parse(data));
};

export const cambiarEstadoGafete = async (id: number, estado: string): Promise<Gafete> => {
  const { data } = await api.patch(`/gafetes/estado/${id}`, { estado });
  return normalizeGafete(responseGafeteSchema.parse(data));
};

export const getGafetesPendientes = async (): Promise<Gafete[]> => {
  const { data } = await api.get("/gafetes/pendientes");
  return gafetesArraySchema.parse(data).map(normalizeGafete);
};
