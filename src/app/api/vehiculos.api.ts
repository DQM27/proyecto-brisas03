// frontend-next/src/app/api/vehiculos.api.ts
import api from "@/src/lib/axios";
import {
  createVehiculoSchema,
  updateVehiculoSchema,
  responseVehiculoSchema,
  vehiculosArraySchema,
  type CreateVehiculoDto,
  type UpdateVehiculoDto,
} from "@/src/app/schemas/vehiculos.schema";

// Crear vehículo
export const createVehiculo = async (payload: CreateVehiculoDto) => {
  const { data } = await api.post("/vehiculos", payload);
  return responseVehiculoSchema.parse(data);
};

// Actualizar vehículo
export const updateVehiculo = async (id: number, payload: UpdateVehiculoDto) => {
  const { data } = await api.patch(`/vehiculos/${id}`, payload);
  return responseVehiculoSchema.parse(data);
};

// Obtener todos los vehículos
export const getVehiculos = async () => {
  const { data } = await api.get("/vehiculos");
  return vehiculosArraySchema.parse(data);
};

// Obtener vehículo por ID
export const getVehiculo = async (id: number) => {
  const { data } = await api.get(`/vehiculos/${id}`);
  return responseVehiculoSchema.parse(data);
};

// Obtener vehículos por contratista
export const getVehiculosPorContratista = async (contratistaId: number) => {
  const { data } = await api.get(`/vehiculos/por-contratista/${contratistaId}`);
  return vehiculosArraySchema.parse(data);
};

// Eliminar vehículo
export const deleteVehiculo = async (id: number) => {
  await api.delete(`/vehiculos/${id}`);
};