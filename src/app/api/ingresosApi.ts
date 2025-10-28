import axios from 'axios';
import { EstadoDevolucionGafete } from '@common/enums/estado-devolucion-gafete.enum';

export interface CreateIngresoDto {
  contratistaId: number;
  gafeteId?: number;
  vehiculoId?: number;
  puntoEntradaId?: number;
  tipoAutorizacion?: 'AUTOMATICA' | 'MANUAL';
  observaciones?: string;
}

export interface UpdateIngresoDto {
  observaciones?: string;
  tipoAutorizacion?: 'AUTOMATICA' | 'MANUAL';
}

const api = axios.create({
  baseURL: 'http://localhost:3000', // Cambiar al host de tu API
});

// Registrar ingreso
export const registrarIngreso = async (dto: CreateIngresoDto, usuarioId: number) => {
  const response = await api.post('/ingresos', dto, { params: { usuarioId } });
  return response.data;
};

// Registrar salida
export const registrarSalida = async (
  contratistaId: number,
  usuarioId: number,
  gafeteEstado?: EstadoDevolucionGafete
) => {
  const params: any = { usuarioId };
  if (gafeteEstado) params.gafeteEstado = gafeteEstado;
  const response = await api.patch(`/ingresos/${contratistaId}/salida`, {}, { params });
  return response.data;
};

// Listar ingresos
export const listarIngresos = async (page = 1, limit = 50) => {
  const response = await api.get('/ingresos', { params: { page, limit } });
  return response.data;
};

// Obtener ingreso por ID
export const obtenerIngreso = async (id: number) => {
  const response = await api.get(`/ingresos/${id}`);
  return response.data;
};

// Actualizar ingreso
export const actualizarIngreso = async (id: number, dto: UpdateIngresoDto) => {
  const response = await api.patch(`/ingresos/${id}`, dto);
  return response.data;
};
