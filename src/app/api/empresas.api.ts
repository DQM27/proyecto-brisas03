import api from "@/src/lib/axios";
import {
  Empresa,
  CreateEmpresaDto,
  UpdateEmpresaDto,
  responseEmpresaSchema,
  empresasArraySchema,
} from "@/src/app/schemas/empresas.schema";

const normalizeEmpresa = (e: Empresa): Empresa => ({
  ...e,
  fechaCreacion: new Date(e.fechaCreacion),
  fechaActualizacion: new Date(e.fechaActualizacion),
  fechaEliminacion: e.fechaEliminacion ? new Date(e.fechaEliminacion) : undefined,
});

export const getEmpresas = async (): Promise<Empresa[]> => {
  const { data } = await api.get("/empresas");
  const parsed = empresasArraySchema.parse(data);
  return parsed.map(normalizeEmpresa);
};

export const getEmpresaById = async (id: number): Promise<Empresa> => {
  const { data } = await api.get(`/empresas/${id}`);
  const parsed = responseEmpresaSchema.parse(data);
  return normalizeEmpresa(parsed);
};

export const createEmpresa = async (payload: CreateEmpresaDto): Promise<Empresa> => {
  const { data } = await api.post("/empresas", payload);
  const parsed = responseEmpresaSchema.parse(data);
  return normalizeEmpresa(parsed);
};

export const updateEmpresa = async (id: number, payload: UpdateEmpresaDto): Promise<Empresa> => {
  const { data } = await api.patch(`/empresas/${id}`, payload);
  const parsed = responseEmpresaSchema.parse(data);
  return normalizeEmpresa(parsed);
};

export const deleteEmpresa = async (id: number): Promise<void> => {
  await api.delete(`/empresas/${id}`);
};

export const restoreEmpresa = async (id: number): Promise<Empresa> => {
  const { data } = await api.post(`/empresas/${id}/restore`);
  const parsed = responseEmpresaSchema.parse(data);
  return normalizeEmpresa(parsed);
};
